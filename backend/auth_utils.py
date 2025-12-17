# import jwt
# from jwt.algorithms import RSAAlgorithm
# import requests
# import json
# from typing import Dict, Any, Optional

# # URL to Hono's exposed JWKS
# JWKS_URL = "http://localhost:4000/api/auth/.well-known/jwks.json"

# # In production, you'd want to cache this response with expiration
# _jwks_cache = None
# _cache_timestamp = 0

# def get_public_key() -> Dict[str, Any]:
#     """Fetch public keys from the JWKS endpoint."""
#     global _jwks_cache, _cache_timestamp

#     import time
#     current_time = time.time()

#     # Refresh cache every 5 minutes (300 seconds)
#     if _jwks_cache is None or (current_time - _cache_timestamp) > 300:
#         try:
#             response = requests.get(JWKS_URL)
#             response.raise_for_status()
#             jwks = response.json()
#             public_keys = {}
#             for jwk in jwks['keys']:
#                 kid = jwk['kid']
#                 public_keys[kid] = RSAAlgorithm.from_jwk(json.dumps(jwk))
#             _jwks_cache = public_keys
#             _cache_timestamp = current_time
#         except Exception as e:
#             print(f"Error fetching JWKS: {e}")
#             raise e

#     return _jwks_cache

# def verify_token(token: str) -> Dict[str, Any]:
#     """
#     Verify JWT token using JWKS from auth server.
#     Returns the token payload if valid, raises exception if invalid.
#     """
#     try:
#         # Decode header to get kid
#         unverified_header = jwt.get_unverified_header(token)
#         kid = unverified_header.get('kid')

#         if not kid:
#             raise jwt.InvalidTokenError("Token header missing kid")

#         # Get public keys and find the matching one
#         public_keys = get_public_key()
#         key = public_keys.get(kid)

#         if not key:
#             raise jwt.InvalidTokenError(f"No public key found for kid: {kid}")

#         # Verify the token signature
#         payload = jwt.decode(
#             token,
#             key=key,
#             algorithms=["RS256"],
#             options={"verify_signature": True, "verify_exp": True, "verify_iat": True}
#         )

#         return payload
#     except jwt.ExpiredSignatureError:
#         raise jwt.ExpiredSignatureError("Token has expired")
#     except jwt.InvalidTokenError as e:
#         raise e
#     except Exception as e:
#         raise jwt.InvalidTokenError(f"Token verification failed: {str(e)}")

# def get_user_id_from_token(token: str) -> Optional[str]:
#     """
#     Extract user ID from JWT token.
#     Returns user ID if token is valid, None otherwise.
#     """
#     try:
#         payload = verify_token(token)
#         # The user ID might be in 'sub', 'id', or another field depending on your auth setup
#         return payload.get('sub') or payload.get('id') or payload.get('user_id')
#     except Exception:
#         return None


# This file contains authentication utilities that are currently not in use
# as authentication has been temporarily disabled for Neon database integration