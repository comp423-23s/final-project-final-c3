"""Club model serves as the data object for representing a specific club."""

from pydantic import BaseModel

class Category(BaseModel):
    id: int | None = None
    name: str

Category.update_forward_refs()