import logging
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.multimodal_utils.text_table_utils import generate_text_summaries
from multimodal_utils.image_utils import  generate_img_summaries
from multimodal_utils.multimodal_stores import create_multi_vector_retriever
from loaders.loader import loading_docs
from providers.chunking_provider import chunking_client_docs
from providers.embedding_provider import get_embedding_model
from providers.llm_provider import get_llm_model
from providers.vectordb_provider import get_vector_store_text,get_vector_store_multimodal
from multimodal_utils.multimodal_stores import extract_page_content

# Set logging level to ERROR to suppress warnings
logging.getLogger("langchain_core").setLevel(logging.ERROR)
logging.getLogger("neo4j.notifications").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.ERROR)
logging.getLogger().setLevel(logging.INFO)


class IngestionRequest(BaseModel):
    vector_index_name: str
    
import nltk
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')


app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to allow specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def hello_world():
    return "Mage APIs Found Here!!"


@app.post("/api/ingestion", response_class=JSONResponse)
async def do_parsing_and_loading_v2(request: IngestionRequest):

    data = {
        "vector_index_name" : request.vector_index_name
    }
    return await loading_chunking_embedding_knowledge_db_creation(
        
        data["vector_index_name"],
    )


async def loading_chunking_embedding_knowledge_db_creation(
        
        vector_index_name,
    ):
    time_start = time.perf_counter()
    ############ Load data ############
    texts , tables = loading_docs(
        "aws"
    )
    if not texts or not tables:
        return {"error": "No documents found or failed to load documents."}
    logging.info("Documents Loaded")
    logging.info(len(texts))
    logging.info(len(tables))
    ############ Embedding, graph model selection ############
    embedding_model = get_embedding_model(
        provider_name="openai", model_name="text-embedding-ada-002"
    )
    # graph model will be `gpt-4o-mini` bcz of it's accuracy
    graph_llm_model = get_llm_model(
        model_provider="openai", model_name="gpt-4o", temperature=0
    )
    ############ Chunking docs ############
    chunked_docs = await chunking_client_docs(
        embedding_model, texts  , "aws"
    )
    logging.info(len(chunked_docs))
    chunked_texts = extract_page_content(chunked_docs)
    logging.info(len(chunked_texts))
    ############ Generate Summaries ############
    logging.info("Text And Table Summarization started...")
    table_summaries = generate_text_summaries(tables , graph_llm_model)
    logging.info(len(table_summaries))
    try:
        logging.info(table_summaries[0])
    except:
        pass
    logging.info("Text And Table Summarization Done")
    logging.info("Image Summarization started...")
    img_base64_list, image_summaries, table_chunks = generate_img_summaries("app/img_temp",graph_llm_model)
    logging.info(len(image_summaries))
    logging.info(image_summaries[0])


    logging.info("Image Summarization Done")

    ############ Add embeddings and chunked documents to the vector store ####
    vector_store = get_vector_store_text(
        "chroma",
        vector_index_name,
        embedding_model,
    )
    vector_store_multivector = get_vector_store_multimodal(
        "chroma",
        vector_index_name,
        embedding_model,
    )
    docstore_status = create_multi_vector_retriever(
        vector_store_multivector,
        table_summaries,
        tables,
        image_summaries,
        img_base64_list,
    )
    logging.info(docstore_status)
    await vector_store.aadd_documents(chunked_docs)
    await vector_store.aadd_texts(table_chunks)

    ############ Adding to graph db ############
    total_time_taken = time.perf_counter() - time_start
    logging.info(total_time_taken)
    return {"message": "Documents loaded, chunked, and embedded successfully!"}



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="127.0.0.1", port=8000)
