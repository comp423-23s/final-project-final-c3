"""Event model serves as the data object for representing a specific event."""

from pydantic import BaseModel
import datetime

class Event(BaseModel):
    eventId: int
    name: str
    clubId: str
    date: datetime
    location: str
    description: str