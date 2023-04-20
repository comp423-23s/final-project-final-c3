"""Week day time holds the weekday and times that a club meets."""
from pydantic import BaseModel
from datetime import time
from .user import User

__authors__ = ["Aryonna Rice"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

class WeekDayTime(BaseModel):
    id: int | None = None
    day: str
    start_time: time
    end_time: time