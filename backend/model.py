from dotenv import load_dotenv  # type: ignore
import os
from langchain_huggingface import HuggingFaceEmbeddings  # type: ignore
from langchain_community.vectorstores import Pinecone as PineconeVectorStore  # type: ignore
from pinecone import Pinecone  # type: ignore
from langchain_google_genai import ChatGoogleGenerativeAI  # type: ignore
from langchain_core.prompts import ChatPromptTemplate  # type: ignore
from sentence_transformers import CrossEncoder  # type: ignore

load_dotenv()

# -------------------------------
# 1) Embeddings (HuggingFace)
# -------------------------------
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

# -------------------------------
# 2) Pinecone Client & Vectorstore
# -------------------------------
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("INDEX_NAME"))

vectordb = PineconeVectorStore(
    index=index,
    embedding=embedding,
    text_key="text"
)

retriever = vectordb.as_retriever(search_kwargs={"k": 5})


# -------------------------------
# 3) Gemini 2.5 Flash (LLM)
# -------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4,
    max_output_tokens=1024
)


# -------------------------------
# 4) RAG Prompt Template
# -------------------------------
prompt = ChatPromptTemplate.from_template("""
You are a helpful financial advisor.
Prefer the given context, but if context is not relevant or incomplete,
use your own financial knowledge to answer correctly.

Rules:
- If question is Hinglish/Hindi → reply in Hinglish.
- If English → reply in English.
- Never use Hindi script.
- Never mention 'documents' or 'context'.
- Keep answer practical, descriptive and clear.

Context (may be partial):
{context}

Question:
{question}

Answer:
""")


# -------------------------------
# 5) Query Rewriter
# -------------------------------
def rewrite_query(q):
    rewritten = llm.invoke(
        f"Rewrite the following user query into a short, information-retrieval optimized financial question:\n{q}"
    ).content
    return rewritten



# -------------------------------
# 6) Cross-Encoder Reranker
# -------------------------------
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def rerank(docs, query):
    if not docs:
        return []
    pairs = [(query, doc.page_content) for doc in docs]
    scores = reranker.predict(pairs)

    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:2]]  # Top 2 relevant matches


# -------------------------------
# 7) Context Builder for RAG
# -------------------------------
def fetch_context(query):
    clean_query = rewrite_query(query)
    docs = retriever.invoke(clean_query)

    selected_docs = rerank(docs, clean_query)
    if not selected_docs:
        return ""

    cleaned = [
        doc.page_content.replace("Tags:", "").replace("Lang:", "").strip()
        for doc in selected_docs
    ]

    return "\n\n".join(cleaned)


# -------------------------------
# 8) Final Answer Function (with Fallback)
# -------------------------------
def answer_question(question):
    context_text = fetch_context(question)

    # CASE 1: No context → fallback to direct LLM
    # if not context_text or len(context_text.strip()) < 20:
    #     try:
    #         print("⚠ No relevant context found → Using Gemini fallback mode")
    #         fallback = llm.invoke(question)
    #         if hasattr(fallback, "content") and fallback.content:
    #             return fallback.content
    #         else:
    #             return "I am here to help! Could you please rephrase your question?"
    #     except Exception as e:
    #         return f"Error using fallback: {str(e)}"
    if context_text.strip() == "":
        return llm.invoke(
            f"Answer like a financial advisor. User question: {question}"
            ).content

    # CASE 2: Normal RAG
    try:
        final_prompt = prompt.format(
            question=question,
            context=context_text
        )
        rag_response = llm.invoke(final_prompt)

        if hasattr(rag_response, "content") and rag_response.content:
            return rag_response.content

        return "I couldn't find an exact answer, but feel free to ask again!"
    except Exception as e:
        return f"RAG error: {str(e)}"
