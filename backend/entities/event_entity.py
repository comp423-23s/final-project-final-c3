'''Event accounts for all registered events in the application.'''

from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.entities.entity_base import EntityBase
from backend.entities.club_entity import ClubEntity
from backend.entities.user_entity import UserEntity
from backend.entities.user_event_entity import user_event_table
from backend.models import Event
from datetime import datetime


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class EventEntity(EntityBase):
    __tablename__ = 'event'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(32), index=True, nullable=False, default=''
    )
    location: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(
        String(250), nullable=False, default='')
    start_time: Mapped[datetime] = mapped_column(nullable=False)
    end_time: Mapped[datetime] = mapped_column(nullable=False)
    show_short_description: Mapped[bool] = mapped_column(nullable=False)
    club_id: Mapped[int] = mapped_column(ForeignKey('club.id'))
    club: Mapped[ClubEntity] = relationship()
    attendees: Mapped[list['UserEntity']] = relationship(secondary=user_event_table)


    @classmethod
    def from_model(cls, model: Event) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            location=model.location,
            description=model.description,
            start_time=model.start_time,
            end_time=model.end_time,
            show_short_description = model.show_short_description,
            club_id = model.club_id,
            attendees=model.attendees
        )

    def to_model(self) -> Event:
        return Event(
            id=self.id,
            name=self.name,
            location=self.location,
            description=self.description,
            start_time=self.start_time,
            end_time=self.end_time,
            club_id = self.club_id,
            attendees= [attendee.to_model() for attendee in self.attendees]
        )

    def update(self, model: Event) -> None:
        self.name = model.name
        self.start_time = model.start_time
        self.end_time = model.end_time
        self.description = model.description
        self.location = model.location
        