"""Event attendence model serves as the data object for representing a registered user for an event."""
from pydantic import BaseModel

class Event_Attendence(BaseModel):
    eventId: int
    userId: int
    