from pydantic import BaseModel
from .user import User
from datetime import datetime 

class PotentialEvent(BaseModel):
      id: int | None = None
      club_id: int
      name: str
      description: str
      location: str
      start_time: datetime
      end_time: datetime
      show_short_description: bool

PotentialEvent.update_forward_refs()