import logging ,os
from io import BytesIO
import tempfile
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from langchain.schema import Document
from langchain_community.document_loaders import S3DirectoryLoader
from unstructured.partition.docx import partition_docx  # Unstructured DOCX handling
# Unstructured image handling
from unstructured.partition.image import partition_image
from unstructured.partition.pdf import partition_pdf  # Unstructured PDF handling

from app.loaders.base_loader import BaseDataLoader
from app.utils.config import config, load_env_variables

env_name = load_env_variables()

path = "app/img_temp/"

def process_file_callback(file_key, file_path):
    """
    Extract text from the file content based on the file type and return it.
    """
    extracted_text = (
        f"\nProcessing file: {file_key}."
    )
    extracted_table = (
        f"\nProcessing file: {file_key}."
    )
    if not os.path.exists(path):
        os.makedirs(path)
    # Handle PDF files
    if file_key.endswith(".pdf"):
        try:
            pdf_parts = partition_pdf(filename = file_path,
                                      extract_image_block_types=["Image", "Table"],          # optional
                                      extract_image_block_to_payload=False,
                                      extract_images_in_pdf=True,
                                      infer_table_structure=True,
                                      image_output_dir_path=path)
            pdf_text = "\n".join([str(part) for part in pdf_parts])
            extracted_text += f"\nExtracted text from {file_key}:\n{pdf_text}"
            for element in pdf_parts:
                if "unstructured.documents.elements.Table" in str(type(element)):
                    extracted_table += f"\nExtracted Table from {file_key}:\n{str(element)}"
                # elif "unstructured.documents.elements.CompositeElement" in str(type(element)):
                                
        except Exception as e:
            logging.error(f"\nFailed to extract text from {file_key}: {str(e)}")
    # Handle DOCX files
    elif file_key.endswith(".docx"):
        try:
            docx_parts = partition_docx(filename = file_path)
            docx_text = "\n".join([str(part) for part in docx_parts])
            extracted_text += f"\nExtracted text from {file_key}:\n{docx_text}"
        except Exception as e:
            extracted_text += f"\nFailed to extract text from {file_key}: {str(e)}"

    # Handle image files (JPG, PNG) using Unstructured
    elif file_key.lower().endswith((".png", ".jpeg", ".jpg")):
        try:
            image_parts = partition_image(filename = file_path)
            image_text = "\n".join([str(part) for part in image_parts])
            extracted_text += f"\nExtracted text from image {file_key}:\n{image_text}"
        except Exception as e:
            extracted_text += (
                f"\nFailed to extract text from image {file_key}: {str(e)}"
            )

    # If the file type isn't recognized
    else:
        extracted_text += f"\nUnrecognized file type for {file_key}."

    return extracted_text , extracted_table


class AWSDataLoader(BaseDataLoader):
    def __init__(
        self,
        bucket_name_loader=None,
        aws_access_key_id_loader=None,
        aws_secret_access_key_loader=None,
    ):
        super().__init__()

        # Allow parameters to override configuration
        self.bucket_name = config[env_name].AWS_BUCKET_NAME
        self.aws_access_key_id = (
            config[env_name].AWS_ACCESS_KEY_ID
        )
        self.aws_secret_access_key = (
            config[env_name].AWS_SECRET_ACCESS_KEY)
        logging.info(
            {
                "bucket": self.bucket_name,
                "access_key": self.aws_access_key_id,
                "secret_key": self.aws_secret_access_key,
            }
        )

    def load_data(self):
        """
        Loads data from the S3 bucket and processes files based on the given file types.
        Returns a list of extracted texts.
        """
        self.file_types = "pdf,docx".split(",")
        
        try:
            if "all" in self.file_types:
                extracted_texts = self.process_all_files_s3_directory()
            else:
                texts ,tables = self.process_files_by_type()
        except (NoCredentialsError, PartialCredentialsError) as e:
            raise RuntimeError(f"Credential error: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"An error occurred: {str(e)}")

        return texts ,tables

    async def aload_data(self, file_type):
        """
        Loads data from the S3 bucket and processes files based on the given file types.
        Returns a list of extracted texts.
        """
        self.file_types = file_type.split(",")
        extracted_texts = []
        try:
            if "all" in self.file_types:
                extracted_texts = await self.aprocess_all_files_s3_directory()
            else:
                extracted_texts = self.process_files_by_type()
        except (NoCredentialsError, PartialCredentialsError) as e:
            raise RuntimeError(f"Credential error: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"An error occurred: {str(e)}")

        return extracted_texts

    async def aprocess_all_files_s3_directory(self):
        """
        Process all files in the S3 bucket using S3DirectoryLoader.
        Returns a list of extracted texts.
        """
        self.loader = S3DirectoryLoader(
            bucket=self.bucket_name,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
        )

        extracted_texts = []
        try:
            documents = (
                await self.loader.aload()
            )  # Use S3DirectoryLoader to load all files
            for doc in documents:
                file_key = doc.metadata["source"]
                logging.info(f"Loading File : {file_key}")
                file_content = (
                    doc.page_content
                )  # Use content directly without conversion
                extracted_texts.append(
                    (file_key, file_content)
                )  # Collect extracted texts
        except Exception as e:
            logging.error(f"Error processing files: {str(e)}")

        return documents

    def process_all_files_s3_directory(self):
        """
        Process all files in the S3 bucket using S3DirectoryLoader.
        Returns a list of extracted texts.
        """
        self.loader = S3DirectoryLoader(
            bucket=self.bucket_name,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
        )

        extracted_texts = []
        try:
            documents = self.loader.load()  # Use S3DirectoryLoader to load all files
            for doc in documents:
                file_key = doc.metadata["source"]
                logging.info(f"Loading File : {file_key}")
                file_content = (
                    doc.page_content
                )  # Use content directly without conversion
                extracted_texts.append(
                    (file_key, file_content)
                )  # Collect extracted texts
        except Exception as e:
            logging.error(f"Error processing files: {str(e)}")

        return documents

    def process_files_by_type(self):
        """
        Process specific file types (e.g., pdf, docx, image) from S3.
        Returns a list of LangChain Document objects.
        """
        # Initialize the S3 client
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
        )

        try:
            paginator = self.s3_client.get_paginator("list_objects_v2")
            pages = paginator.paginate(Bucket=self.bucket_name)

            file_type_filters = {
                "pdf": ".pdf",
                "docx": ".docx",
                "image": (".png", ".jpeg", ".jpg"),
            }
            tables = []
            texts = []  
            for page in pages:
                if "Contents" in page:
                    for obj in page["Contents"]:
                        file_key = obj["Key"]
                        file_name = os.path.basename(file_key)
                        for file_type in self.file_types:
                            extension = file_type_filters.get(
                                file_type.strip())
                            if extension and (
                                (
                                    isinstance(extension, tuple)
                                    and file_key.endswith(extension)
                                )
                                or file_key.endswith(extension)
                            ):
                                # Retrieve file content directly from S3
                                response = self.s3_client.get_object(
                                    Bucket=self.bucket_name, Key=file_key
                                )
                                file_content = response[
                                    "Body"
                                ].read()  # Retrieve content directly
                                with tempfile.TemporaryDirectory() as temp_dir:
                                    temp_file_path = os.path.join(temp_dir, file_name)

                                # Write the blob data to a temp file
                                    with open(temp_file_path, "wb") as temp_file:
                                        temp_file.write(file_content)

                                # Pass the file path instead of raw data
                                    text, table = process_file_callback(file_key, temp_file_path)

                                print(f"Processed file: {file_key}")    
                                # Extract text content from the file
                                text_document = Document(
                                page_content=text,  # The extracted text/content
                                metadata={
                                    "source": file_key,  # File name or path
                                    # File type (pdf, docx, image)
                                    "file_type": file_type,
                                },
                                )
                                texts.append(text_document)
                                
                                table_document = Document(
                                    page_content=table,  # The extracted text/content
                                    metadata={
                                        "source": file_key,  # File name or path
                                        # File type (pdf, docx, image)
                                        "file_type": file_type,
                                    },
                                )
                                tables.append(table_document)

        except Exception as e:
            logging.error(f"Error processing files: {str(e)}")

        return texts , tables
