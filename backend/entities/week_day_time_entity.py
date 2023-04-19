'''Week day time keeps track of the weekday and the time that a club meets.'''


from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.week_day_time import WeekDayTime
from backend.entities.entity_base import EntityBase
from datetime import time



__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class WeekDayTimeEntity(EntityBase):
    __tablename__ = 'week_day_time'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    day: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    start_time: Mapped[str] = mapped_column(String(100), nullable=False)
    end_time: Mapped[str] = mapped_column(String(100), nullable=False)
    club_id: Mapped[int] = mapped_column(ForeignKey('club.id'), nullable=True)
    club: Mapped['ClubEntity'] = relationship(back_populates='meeting_times')
    potential_club_id: Mapped[int] = mapped_column(ForeignKey('potential_club.id'), nullable=True)
    potential_club: Mapped['PotentialClubEntity'] = relationship(back_populates='meeting_times')

    @classmethod
    def from_model(cls, model: WeekDayTime) -> Self:
        return cls(
            id=model.id,
            day=model.day,
            start_time=model.start_time,
            end_time=model.end_time
        )
    
    def to_model(self) -> WeekDayTime:
        return WeekDayTime(
            id=self.id,
            day=self.day,
            start_time=self.start_time,
            end_time=self.end_time
        )
    
from backend.entities.club_entity import ClubEntity
from backend.entities.potential_club_entity import PotentialClubEntity