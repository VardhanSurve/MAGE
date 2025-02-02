# azure_loader.py
import logging
import os,tempfile
from io import BytesIO

from azure.storage.blob import BlobServiceClient
from langchain.schema import Document
from langchain_community.document_loaders import AzureBlobStorageContainerLoader
from unstructured.partition.docx import partition_docx  # Unstructured DOCX handling
# Unstructured image handling
from unstructured.partition.image import partition_image
from unstructured.partition.pdf import partition_pdf  # Unstructured PDF handling

from app.loaders.base_loader import BaseDataLoader
from app.utils.config import config, load_env_variables

import os
env_name = load_env_variables()

SAS_URL = config[env_name].SAS_URL
AZURE_CONTAINER_NAME = config[env_name].AZURE_CONTAINER_NAME
CONN_STR = config[env_name].CONNECTION_STR
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


# Check if the directory exists, if not, create it
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


class MultiModalAzureDataLoader(BaseDataLoader):
    def __init__(self):
        # Fetch credentials and file types from .env
        super().__init__()
        self.sas_url = SAS_URL
        self.conn_str = CONN_STR
        self.container_name = AZURE_CONTAINER_NAME
        self.file_types = os.getenv("FILE_TYPE", "all").split(",")

    def load_data(self):
        """
        Loads data from the Azure Blob Storage and processes files based on the given file types.
        Returns a list of extracted texts.
        """

        self.file_types = "pdf,docx".split(",")

        try:
            if "all" in self.file_types:
                extracted_texts = self.process_all_files()
            else:
                texts ,tables = self.process_files_by_type()
        except Exception as e:
            raise RuntimeError(f"An error occurred: {str(e)}")

        return texts ,tables

    def process_all_files(self):
        """
        Process all files in the Azure Blob Storage using AzureBlobStorageContainerLoader.
        Returns a list of extracted texts.
        """

        self.loader = AzureBlobStorageContainerLoader(
            conn_str=self.conn_str, container=self.container_name
        )
        langchain_documents = []  # Initialize a list for Langchain Document objects
        try:
            documents = (
                self.loader.load()
            )  # Load all files using AzureBlobStorageContainerLoader
            for doc in documents:
                file_key = doc.metadata["source"]
                file_content = doc.page_content  # Get the content directly
                # Create a Langchain Document
                langchain_doc = Document(
                    page_content=file_content, metadata={"source": file_key}
                )
                # Collect Langchain Documents
                langchain_documents.append(langchain_doc)
        except Exception as e:
            raise RuntimeError(
                f"Error processing files: {str(e)}"
            )  # Raise an error instead of printing
        
        return langchain_documents

    def process_files_by_type(self):
        """
        Process specific file types (e.g., pdf, docx, image).
        Returns a list of LangChain Document objects.
        """
        self.blob_service_client = BlobServiceClient.from_connection_string(
            self.conn_str
        )
        self.container_client = self.blob_service_client.get_container_client(
            self.container_name
        )
        tables = []
        texts = []
        try:
            blob_list = self.container_client.list_blobs()

            file_type_filters = {
                "pdf": ".pdf",
                "docx": ".docx",
                "image": (".png", ".jpeg", ".jpg"),
            }

            for blob in blob_list:
                file_key = blob.name  # Full path in the blob storage (e.g., data/filename.pdf)
                file_name = os.path.basename(file_key)  # Extract the actual file name (e.g., filename.pdf)
              
                for file_type in self.file_types:
                    extension = file_type_filters.get(file_type.strip())
                    
                    if extension and (
                        (isinstance(extension, tuple) and file_name.endswith(extension))
                        or file_name.endswith(extension)
                    ):
                        try:
                            # Retrieve file content directly from Azure Blob Storage
                            blob_data = self.container_client.download_blob(blob).readall()

                            # Create a temporary directory
                            with tempfile.TemporaryDirectory() as temp_dir:
                                temp_file_path = os.path.join(temp_dir, file_name)

                                # Write the blob data to a temp file
                                with open(temp_file_path, "wb") as temp_file:
                                    temp_file.write(blob_data)

                                # Pass the file path instead of raw data
                                text, table = process_file_callback(file_key, temp_file_path)

                            print(f"Processed file: {file_key}")

                        except Exception as e:
                            print(f"Error processing {file_key}: {e}")
                        
                        
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
