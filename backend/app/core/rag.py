import os
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.embeddings.base import Embeddings
from sentence_transformers import SentenceTransformer


class LocalEmbeddings(Embeddings):
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts):
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embeddings.tolist()

    def embed_query(self, text):
        embedding = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True
        )
        return embedding.tolist()


class RAGEngine:
    def __init__(self, persist_dir="./chroma_db"):
        self.persist_dir = persist_dir
        self.embeddings = LocalEmbeddings()
        self.vectorstore = None
        self._load_or_create()

    def _load_or_create(self):
        self.vectorstore = Chroma(
            persist_directory=self.persist_dir,
            embedding_function=self.embeddings
        )

    def index_document(self, text: str, metadata: dict = None):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )

        chunks = splitter.split_text(text)

        documents = [
            Document(
                page_content=chunk,
                metadata=metadata or {}
            )
            for chunk in chunks
        ]

        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()

    def retrieve(self, query: str, k: int = 5):
        if not self.vectorstore:
            return []

        return self.vectorstore.similarity_search(query, k=k)

    def get_context(self, query: str, k: int = 5) -> str:
        docs = self.retrieve(query, k)

        return "\n\n".join(
            [doc.page_content for doc in docs]
        )