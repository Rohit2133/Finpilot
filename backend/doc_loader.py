from langchain_community.document_loaders import PyPDFLoader # type: ignore
from langchain_text_splitters import RecursiveCharacterTextSplitter # type: ignore
from langchain_huggingface import HuggingFaceEmbeddings # type: ignore
from langchain_community.vectorstores import Pinecone as PineconeVectorStore # type: ignore

from dotenv import load_dotenv # type: ignore
from pinecone import Pinecone, ServerlessSpec # type: ignore
import hashlib
import os

load_dotenv()

# --- Pinecone Init (NEW SDK) ---
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = os.getenv("INDEX_NAME")

# Optionally check if index exists
if index_name not in [idx["name"] for idx in pc.list_indexes()]:
    raise ValueError(f"Index '{index_name}' does not exist in Pinecone.")

index = pc.Index(index_name)   # connect to index

# --- Load PDFs ---
pdf_folder = r"C:\Users\dell\Desktop\Fintech-project\backend\data"
pdf_files = [os.path.join(pdf_folder, f) for f in os.listdir(pdf_folder) if f.endswith(".pdf")]

docs = []
for pdf in pdf_files:
    loader = PyPDFLoader(pdf)
    docs.extend(loader.load())

# --- Split documents ---
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
documents = splitter.split_documents(docs)

print(f"Total chunks prepared: {len(documents)}")

# --- Embeddings ---
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

# --- Connect to Pinecone VectorStore ---
vectorstore = PineconeVectorStore(
    index=index,
    embedding=embedding,
    text_key="text"   
)

# --- Safe ID generator ---
def generate_id(doc, i):
    base = f"{doc.metadata.get('source','')}-{doc.metadata.get('page','')}-{i}"
    return hashlib.md5(base.encode()).hexdigest()

# --- ONLY add new documents ---
ids = [generate_id(doc, i) for i, doc in enumerate(documents)]

print("Upserting only new documents...")

vectorstore.add_documents(
    documents=documents,
    ids=ids
)

print("✅ Ingestion complete. Pinecone index updated ONLY with new data.")
