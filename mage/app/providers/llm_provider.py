
from langchain_openai import ChatOpenAI

from app.utils.config import config, load_env_variables

# Load environment variables once
env_name = load_env_variables()


def openai_llm_model(
        api_key,
        model_name="gpt-4o",
        temperature: float = 0):
    return ChatOpenAI(
        api_key=api_key,
        model_name=model_name,
        temperature=temperature)



def get_llm_model(
        model_provider: str,
        model_name: str,
        temperature: float = 0.1):
    model_provider = model_provider.lower()

    openai_key = config[env_name].OPENAI_API_KEY
    


    model = openai_llm_model(
            api_key=openai_key,
            model_name=model_name,
            temperature=temperature)

    


    return model
