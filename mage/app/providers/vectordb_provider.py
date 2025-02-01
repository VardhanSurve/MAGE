import os
# from langchain_community.vectorstores import AzurechromaDBVectorSearch
import chromadb
from app.utils.config import config, load_env_variables
from langchain_chroma import Chroma

# Load environment variables once
env_name = load_env_variables()


def get_vector_store_text(
    vector_store_provider: str,
    vector_index_name,
    embedding_model
):
    provider = vector_store_provider.lower()

    if provider == "chroma":
        return _get_chroma_vector_store_text(embedding_model,vector_index_name)
    else:
        raise ValueError(f"Unknown vector store: {vector_store_provider}")



def _get_chroma_vector_store_text(embedding_model,vector_index_name):
    

    chroma_client = chromadb.HttpClient(
        host="65.2.34.8",
        port=8000,
    )
    chroma_client.get_or_create_collection(vector_index_name)

    return Chroma(
        client=chroma_client,
        collection_name=vector_index_name,
        embedding_function=embedding_model,
        persist_directory="./chroma_data",
    )




def get_vector_store_multimodal(
    vector_store_provider: str,
    vector_index_name,
    embedding_model,

):
    provider = vector_store_provider.lower()
    
    if provider == "chroma":
        return _get_chroma_vector_store_multimodal(embedding_model,vector_index_name+"-multimodal")
    else:
        raise ValueError(f"Unknown vector store: {vector_store_provider}")



def _get_chroma_vector_store_multimodal(embedding_model ,vector_index_name):
    

    chroma_client = chromadb.HttpClient(
        host="65.2.34.8",
        port=8000,
    )
    chroma_client.get_or_create_collection(vector_index_name)

    return Chroma(
        client=chroma_client,
        collection_name=vector_index_name,
        embedding_function=embedding_model,
        persist_directory="./chroma_data",
    )
