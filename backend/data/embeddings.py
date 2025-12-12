"""
Module for generating document embeddings using FastEmbed.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from typing import List
import logging
from fastembed import TextEmbedding


class EmbeddingService:
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        """
        Initialize the embedding service with the specified model.
        By default, uses the BGE small model which generates embeddings.
        """
        try:
            self.model = TextEmbedding(model_name=model_name)
            # Verify that the model produces 384-dimensional embeddings
            sample_embedding = list(self.model.embed(["test"]).__next__())
            if len(sample_embedding) != 384:
                raise ValueError(f"Model {model_name} does not produce 384-dimensional embeddings")
        except Exception as e:
            logging.error(f"Failed to initialize embedding model: {e}")
            raise

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text string.
        
        Args:
            text: Input text to embed
            
        Returns:
            384-dimensional embedding vector as a list of floats
        """
        try:
            embeddings = list(self.model.embed([text]))
            return embeddings[0]
        except Exception as e:
            logging.error(f"Failed to generate embedding for text: {e}")
            raise

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple text strings.
        
        Args:
            texts: List of input texts to embed
            
        Returns:
            List of 384-dimensional embedding vectors
        """
        try:
            embeddings = list(self.model.embed(texts))
            return [emb.tolist() for emb in embeddings]
        except Exception as e:
            logging.error(f"Failed to generate embeddings for texts: {e}")
            raise