"""
Unit tests for the embeddings module.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from data.embeddings import EmbeddingService


class TestEmbeddingService(unittest.TestCase):
    def setUp(self):
        self.embedding_service = EmbeddingService()

    def test_384_dimension_embeddings(self):
        """Test that embeddings are 384-dimensional as required."""
        text = "This is a test sentence."
        embedding = self.embedding_service.embed_text(text)
        self.assertEqual(len(embedding), 384)
        
        # Test multiple texts
        texts = ["First sentence.", "Second sentence.", "Third sentence."]
        embeddings = self.embedding_service.embed_texts(texts)
        self.assertEqual(len(embeddings), 3)
        for embedding in embeddings:
            self.assertEqual(len(embedding), 384)


if __name__ == '__main__':
    unittest.main()