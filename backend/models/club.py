"""Club model serves as the data object for representing a specific club."""

from pydantic import BaseModel
from .user import User


class Club(BaseModel):
    id: int | None = None
    club_code: str
    name: str
    description: str
    members: list['User'] = []
    leaders: list['User'] = []

class NewClub(BaseModel):
    name: str
    description: str
    members: list['User']
    leaders: list['User']

Club.update_forward_refs()
NewClub.update_forward_refs()
