import logging
from enum import Enum


# Define the Enum for data loader types
class DataLoaderType(Enum):
   
    AZURE = "azure"
    AWS = "aws"

# Function to load the appropriate data loader based on the source
def load_source(
        source: str,
        ):
    try:
        source_enum = DataLoaderType(source.lower())
    except ValueError:
        raise ValueError(f"Unsupported source: {source}")

    if source_enum == DataLoaderType.AZURE:
        from app.loaders.multimodal_azure_loader import MultiModalAzureDataLoader

        loader = MultiModalAzureDataLoader()
    if source_enum == DataLoaderType.AWS:
        from app.loaders.aws_loader import AWSDataLoader

        loader = AWSDataLoader()    

    else:
        raise ValueError(f"Unsupported source: {source_enum}")

    return loader


def loading_docs(
    source,
):
    logging.info("Documents Loading...")
    loader = load_source(
        source,
    )
    texts , tables = loader.load_data()
    return texts , tables
