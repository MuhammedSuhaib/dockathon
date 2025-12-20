from pydantic import BaseModel
from typing import Optional

# User context model to pass information from frontend localStorage
class UserContext(BaseModel):
    name: str = "User"
    uid: Optional[int] = None
    email: Optional[str] = None
    personalization_data: Optional[dict] = None
    session_id: Optional[str] = None