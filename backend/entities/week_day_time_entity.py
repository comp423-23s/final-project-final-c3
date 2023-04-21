'''Week day time keeps track of the weekday and the time that a club meets.'''


from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.week_day_time import WeekDayTime
from backend.entities.entity_base import EntityBase
from datetime import time, datetime



__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class WeekDayTimeEntity(EntityBase):
    __tablename__ = 'week_day_time'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    day: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    club_id: Mapped[int] = mapped_column(ForeignKey('club.id'), nullable=True)
    club: Mapped['ClubEntity'] = relationship(back_populates='meeting_times')
    potential_club_id: Mapped[int] = mapped_column(ForeignKey('potential_club.id'), nullable=True)
    potential_club: Mapped['PotentialClubEntity'] = relationship(back_populates='meeting_times')

    @classmethod
    def from_model(cls, model: WeekDayTime) -> Self:
        return cls(
            id=model.id,
            day=model.day,
            start_time=datetime.strptime(model.start_time, '%H:%M').time(),
            end_time=datetime.strptime(model.end_time, '%H:%M').time()
        )
    
    def to_model(self) -> WeekDayTime:
        return WeekDayTime(
            id=self.id,
            day=self.day,
            start_time=self.start_time.strftime("%H:%M"),
            end_time=self.end_time.strftime("%H:%M")
        )
    
from backend.entities.club_entity import ClubEntity
from backend.entities.potential_club_entity import PotentialClubEntity