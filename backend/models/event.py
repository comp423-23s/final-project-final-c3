"""Event model serves as the data object for representing a specific event."""

from pydantic import BaseModel
from datetime import datetime 
from .user import User

__authors__ = ["Aryonna Rice"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

class Event(BaseModel):
    id: int | None = None
    name: str
    club_id: int
    start_time: datetime
    end_time: datetime
    location: str
    description: str
    show_short_description: bool
    attendees: list[User] = []

class NewEvent(BaseModel):
    name: str
    club_id: int
    start_time: datetime
    end_time: datetime
    location: str
    description: str
    attendees: list[User] = []

Event.update_forward_refs()
NewEvent.update_forward_refs()
