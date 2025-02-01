import logging
from app.utils.config import config, load_env_variables
from langchain_openai import OpenAIEmbeddings

# Load environment variables once
env_name = load_env_variables()


def openai_embed_model(api_key, model="text-embedding-ada-002"):
    return OpenAIEmbeddings(api_key=api_key, model=model)

def get_embedding_model(provider_name: str, model_name: str):
    provider_name = provider_name.lower()

    # Dictionary mapping provider names to their model constructors
    model_factory = {
        "openai": lambda: openai_embed_model(
            api_key=config[env_name].OPENAI_API_KEY, model=model_name ,
        ),
    }


    return model_factory.get(provider_name, model_factory["openai"])()


async def embedding_docs(chunked_docs, embedding_model):
    texts = [chunk.page_content for chunk in chunked_docs]
    logging.info("Embedding started...")
    
    
    embeddings = embedding_model.embed_documents(texts)
    logging.info("Embedding Done")
    
    return embeddings
