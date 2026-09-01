import os
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

class RAGEngine:
    def __init__(self, persist_dir="./chroma_db"):
        self.persist_dir = persist_dir
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        self.vectorstore = None
        self._load_or_create()

    def _load_or_create(self):
        try:
            self.vectorstore = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )
        except:
            self.vectorstore = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=self.embeddings
            )

    def index_document(self, text: str, metadata: dict = None):
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_text(text)
        documents = [Document(page_content=chunk, metadata=metadata or {}) for chunk in chunks]
        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()

    def retrieve(self, query: str, k: int = 5):
        if not self.vectorstore:
            return []
        return self.vectorstore.similarity_search(query, k=k)

    def get_context(self, query: str, k: int = 5) -> str:
        docs = self.retrieve(query, k)
        return "\n\n".join([doc.page_content for doc in docs])