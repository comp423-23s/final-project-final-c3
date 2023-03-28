from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from .user_entity import UserEntity
from .event_entity import EventEntity
from ..models import Club, Event, Event_Attendence


class EventAttendenceEntity(EntityBase):
    __tablename__ = "event_attendence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    event_id: Mapped[int] = mapped_column(ForeignKey('events.id'), nullable=True)
    event: Mapped[EventEntity] = relationship(back_populates='event_attendence')

    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)
    user: Mapped[UserEntity] = relationship(back_populates='event_attendence')

    @classmethod
    def from_model(cls, model: Event_Attendence) -> Self:
        return cls(
            id=model.id,
            event_id=model.event_id,
            user_id=model.user_id
        )

    def to_model(self) -> Event_Attendence:
        return Event_Attendence(
            id=self.id,
            event_id=self.event_id,
            user_id=self.user_id
        )
