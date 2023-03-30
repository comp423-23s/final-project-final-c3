'''Event accounts for all registered events in the application.'''


from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from .user_role_entity import user_role_table
from ..models import User, Club, Event
from datetime import datetime


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class EventEntity(EntityBase):
    __tablename__ = 'events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(32), index=True, nullable=False, default=''
    )
    location: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    date: Mapped[datetime] = mapped_column(
        datetime(), nullable=False)
    clubId: Mapped[int] = mapped_column(Integer, nullable=False)


    @classmethod
    def from_model(cls, model: Event) -> Self:
        return cls(
            id=model.id,
            location=model.location,
            description=model.description,
            date=model.date
            clubId = model.clubId
        )

    def to_model(self) -> Event:
        return User(
            id=self.id,
            location=self.location,
            description=self.description,
            date=self.date,
            clubId = self.clubId
        )

    def update(self, model: Event) -> None:
        self.name = model.name
        self.date = model.date
        self.description = model.description
