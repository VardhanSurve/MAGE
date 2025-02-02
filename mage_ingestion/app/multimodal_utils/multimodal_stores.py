from langchain_community.storage import MongoDBByteStore
from langchain.retrievers.multi_vector import MultiVectorRetriever
# from langchain.storage import InMemoryStore
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
import uuid
from app.utils.config import config, load_env_variables

# Load environment variables once
env_name = load_env_variables()

def extract_page_content(docs):
    """Extract page_content from a list of LangChain Document objects."""
    return [doc.page_content for doc in docs]

mongo_conn_str = config[env_name].MONGODB_CONNECTION_STR
db = config[env_name].MONGODB_DATABASE
collection= config[env_name].MONGODB_COLLECTION

store = MongoDBByteStore(mongo_conn_str, db_name=db,
                             collection_name=collection)


def create_multi_vector_retriever(
    vectorstore, table_summaries, tables, image_summaries, images
):
    """
    Create retriever that indexes summaries, but returns raw images or texts
    """

    # Initialize the storage layer
    id_key = "doc_id"

    # Create the multi-vector retriever
    retriever = MultiVectorRetriever(
        vectorstore=vectorstore,
        docstore=store,
        id_key=id_key,
        search_kwargs={"k":6}
    )

    # Helper function to add documents to the vectorstore and docstore
    def add_documents(retriever, doc_summaries, doc_contents):
        doc_ids = [str(uuid.uuid4()) for _ in doc_contents]
        summary_docs = [
            Document(page_content=s, metadata={id_key: doc_ids[i]})
            for i, s in enumerate(doc_summaries)
        ]
        retriever.vectorstore.add_documents(summary_docs)
        retriever.docstore.mset(list(zip(doc_ids, doc_contents)))

    # Add texts, tables, and images
    # Check that text_summaries is not empty before adding
    # if text_summaries:
    #     add_documents(retriever, text_summaries, texts)
    # Check that table_summaries is not empty before adding
    if table_summaries:
        page_contents = extract_page_content(tables)
        add_documents(retriever, table_summaries, page_contents)
    # Check that image_summaries is not empty before adding
    if image_summaries:
        add_documents(retriever, image_summaries, images)

    return "Successful"

