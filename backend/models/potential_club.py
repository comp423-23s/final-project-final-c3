"""Potential Club model serves as the data object for representing a club to be reviewed by an Admin."""

from pydantic import BaseModel
from .user import User



class PotentialClub(BaseModel):
    id: int
    name: str
    description: str
    founder_id: int

PotentialClub.update_forward_refs()