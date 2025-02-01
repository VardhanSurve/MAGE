from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.retrievers import EnsembleRetriever
from langchain.schema.runnable import RunnableMap
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import Neo4jVector
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from nemoguardrails import RailsConfig
from nemoguardrails.integrations.langchain.runnable_rails import RunnableRails
from langchain.retrievers.multi_vector import MultiVectorRetriever
from langchain_community.storage import MongoDBByteStore
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.documents import Document
from app.multimodal.image_utils import split_image_text_types , img_prompt_func
from app.providers.embedding_provider import get_embedding_model, openai_embed_model
from app.providers.llm_provider import get_llm_model
from app.providers.vectordb_provider import get_vector_store_multimodal , get_vector_store_text
from app.prompt.templates import system_prompt
from app.utils.config import config, load_env_variables
from app.utils.initialize import neo4j_creds
env_name = load_env_variables()

url, username, password = neo4j_creds()
openai_embedding = openai_embed_model()

mongo_conn_str = config[env_name].MONGODB_CONNECTION_STR
db = config[env_name].MONGODB_DATABASE
collection= config[env_name].MONGODB_COLLECTION

def qa_chain_with_source(llm, retriever):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )
    chain = (
            RunnableMap(
                {
                    "test": lambda x: print(x),
                    "input": lambda x: x["input"],
                    "context": lambda x: retriever.invoke(x["input"]),
                }
            )
            | prompt
            | llm
            | StrOutputParser()
    )

    return chain


def esnsemble_chain(llm, retriever):
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    return rag_chain



guardrails_config = RailsConfig.from_path("app/config_guardrails")
guardrails = RunnableRails(config=guardrails_config)
env_name = load_env_variables()
TEMPERATURE = config[env_name].TEMPERATURE
INDEX_NAME = config[env_name].INDEX_NAME
LLM_PROVIDER = config[env_name].LLM_PROVIDER
LLM_MODEL_NAME = config[env_name].LLM_MODEL_NAME
EMBEDDING_PROVIDER = config[env_name].EMBEDDING_PROVIDER
VECTOR_STORE_NAME=config[env_name].VECTOR_STORE_NAME

def hybrid_kg_ensemble_retriever_with_guardrails(question: str):
    embed_model = get_embedding_model(EMBEDDING_PROVIDER)
    vector_store = get_vector_store_text(VECTOR_STORE_NAME, embed_model)
    vector_retriever = vector_store.as_retriever()

    # ensemble_retriever = EnsembleRetriever(retrievers=[vector_retriever])
    chain = qa_chain_with_source(get_llm_model(LLM_PROVIDER, LLM_MODEL_NAME, TEMPERATURE),
                                 vector_retriever)  
    # chain_with_guardrails = guardrails | chain
    # response = ensemble_retriever.invoke(question)
    response = chain.invoke({"input": question})
    return response



    
def multimodal_retriever(question: str):
    store = MongoDBByteStore(mongo_conn_str, db_name=db,collection_name=collection)
    embed_model = get_embedding_model(EMBEDDING_PROVIDER)
    vector_store = get_vector_store_multimodal(VECTOR_STORE_NAME, embed_model)    
    id_key = "doc_id"
    multivector_retriever = MultiVectorRetriever(
        vectorstore=vector_store,
        docstore=store,
        id_key=id_key,
        search_kwargs={"k": 6}
        )
    model =get_llm_model(LLM_PROVIDER, LLM_MODEL_NAME, TEMPERATURE) 
    chain = (
        {
            "context": multivector_retriever | RunnableLambda(split_image_text_types), 
            # | RunnableLambda(rerank_results),
            "question": RunnablePassthrough(),
        }
        | RunnableLambda(img_prompt_func)
        | model
        | StrOutputParser()
    )
 
    response = chain.invoke(question)
    # print(response)
    return response 