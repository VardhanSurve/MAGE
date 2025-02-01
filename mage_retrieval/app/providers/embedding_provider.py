
from langchain_openai import AzureOpenAIEmbeddings  

from app.utils.config import config, load_env_variables

env_name = load_env_variables()
OPENAI_API_KEY = config[env_name].OPENAI_API_KEY
api_version=config[env_name].AZURE_OPENAIAPI_EMBEDDING_VERSION
base_url=config[env_name].AZURE_OPENAI_EMBEDDING_ENDPOINT


def get_embedding_model(model_provider_name: str):
    if model_provider_name == 'openai':
        return openai_embed_model(api_key=OPENAI_API_KEY)
    else:
        
        return "Invalid Embedding Model"


def openai_embed_model(api_key=OPENAI_API_KEY, model="text-embedding-ada-002"):
    openai_embedding = AzureOpenAIEmbeddings(api_key=api_key, model=model,api_version=api_version, base_url=base_url)
    return openai_embedding
