"""
Script for indexing documents from the docs directory into the vector store.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from pathlib import Path
from typing import List
from data.embeddings import EmbeddingService
from data.vector_store import VectorStore, DocumentChunk
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def chunk_document(content: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    """
    Split document content into overlapping chunks.
    
    Args:
        content: Document content to chunk
        chunk_size: Size of each chunk in characters
        overlap: Overlap between chunks in characters
        
    Returns:
        List of text chunks
    """
    if len(content) <= chunk_size:
        return [content]
    
    chunks = []
    start = 0
    
    while start < len(content):
        end = start + chunk_size
        chunk = content[start:end]
        chunks.append(chunk)
        
        # Move start position by (chunk_size - overlap)
        start = end - overlap
        
        # If the remaining content is less than chunk_size, include it as the final chunk
        if len(content) - start < chunk_size:
            if start < len(content):
                chunks.append(content[start:])
            break
    
    return chunks

def index_documents(docs_path: str = "../docs", vector_store: VectorStore = None):
    """
    Index all .md and .mdx files from the specified directory into the vector store.
    
    Args:
        docs_path: Path to the directory containing documents to index
        vector_store: VectorStore instance to use for storage
    """
    if vector_store is None:
        vector_store = VectorStore()
    
    embedding_service = EmbeddingService()
    
    # Create Path object for docs directory
    docs_dir = Path(docs_path)
    
    if not docs_dir.exists():
        logger.error(f"Docs directory does not exist: {docs_path}")
        return
    
    # Find all .md and .mdx files recursively
    doc_files = list(docs_dir.rglob("*.md")) + list(docs_dir.rglob("*.mdx"))
    
    logger.info(f"Found {len(doc_files)} documents to index")
    
    total_chunks = 0
    processed_files = 0
    
    for doc_file in doc_files:
        try:
            logger.info(f"Processing file: {doc_file}")
            
            # Read the document content
            with open(doc_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Skip empty files
            if not content.strip():
                logger.warning(f"Skipping empty file: {doc_file}")
                continue
            
            # Chunk the document content
            chunks = chunk_document(content)
            
            # Process each chunk
            for i, chunk_text in enumerate(chunks):
                try:
                    # Generate embedding for the chunk
                    embedding = embedding_service.embed_text(chunk_text)
                    
                    # Create a unique ID for this chunk
                    chunk_id = f"{doc_file.as_posix()}_{i}"
                    
                    # Create DocumentChunk object
                    doc_chunk = DocumentChunk(
                        chunk_id=chunk_id,
                        content=chunk_text,
                        doc_path=doc_file.as_posix(),
                        embedding=embedding,
                        metadata={
                            "original_file": doc_file.name,
                            "chunk_index": i,
                            "total_chunks": len(chunks)
                        }
                    )
                    
                    # Store in vector database
                    success = vector_store.store_document_chunk(doc_chunk)
                    
                    if success:
                        total_chunks += 1
                        logger.debug(f"Successfully stored chunk {chunk_id}")
                    else:
                        logger.error(f"Failed to store chunk {chunk_id}")
                        
                except Exception as e:
                    logger.error(f"Error processing chunk {i} of file {doc_file}: {e}")
                    continue  # Continue with next chunk
            
            processed_files += 1
            logger.info(f"Completed processing file: {doc_file}")
            
        except Exception as e:
            logger.error(f"Error processing file {doc_file}: {e}")
            continue  # Continue with next file
    
    logger.info(f"Indexing completed. Processed {processed_files} files and {total_chunks} chunks.")


if __name__ == "__main__":
    logger.info("Starting document indexing process...")
    index_documents()
    logger.info("Document indexing completed.")