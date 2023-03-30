"""Club model serves as the data object for representing a specific club."""

from pydantic import BaseModel

class Club(BaseModel):
    clubId: int
    name: str
    description: str