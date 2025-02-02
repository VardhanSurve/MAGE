
from langchain_openai import OpenAIEmbeddings  

from utils.config import config, load_env_variables

env_name = load_env_variables()
OPENAI_API_KEY = config[env_name].OPENAI_API_KEY


def get_embedding_model(model_provider_name: str):
    if model_provider_name == 'openai':
        return openai_embed_model(api_key=OPENAI_API_KEY)
    else:
        
        return "Invalid Embedding Model"


def openai_embed_model(api_key = OPENAI_API_KEY,model="text-embedding-ada-002"):
    openai_embedding = OpenAIEmbeddings(api_key=api_key,model=model)
    return openai_embedding
