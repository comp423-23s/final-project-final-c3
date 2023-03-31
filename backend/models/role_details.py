from pydantic import BaseModel
from .user import User
from .permission import Permission

class RoleDetails(BaseModel):
    id: int | None = None
    name: str
    permissions: list[Permission]
    users: list[User]