"""Potential Club model serves as the data object for representing a club to be reviewed by an Admin."""

from pydantic import BaseModel

from backend.models.category import Category
from .user import User
from .week_day_time import WeekDayTime

class PotentialClub(BaseModel):
    id: int | None = None
    name: str
    description: str
    founder_id: int
    meeting_times: list['WeekDayTime'] = []
    categories: list['Category'] = []

PotentialClub.update_forward_refs()