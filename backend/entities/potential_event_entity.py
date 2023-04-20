'''PotentialEvents accounts for all registered events in the application.'''

from sqlalchemy import Integer, String, insert, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.potential_club import PotentialEvent
from backend.entities.entity_base import EntityBase
from datetime import datetime
from backend.models.user import User

__authors__ = ['Karen Gonzalez-Palomo']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'

class PotentialEventEntity(EntityBase):
    __tablename__ = 'potential_event'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    club_id: Mapped[int]
    name: Mapped[str] = mapped_column(String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    location: Mapped[str] = mapped_column(String(64), nullable=False, default='')
    start_date: datetime = mapped_column(DateTime, nullable=False)
    end_date: datetime = mapped_column(DateTime, nullable=False)
    show_short_description: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    @classmethod 
    def from_model(cls, model: PotentialEvent) -> Self:
        return cls(
            id=model.id,
            club_id=model.club_id,
            name=model.name,
            description=model.description,
            location=model.location,
            start_time=model.start_time,
            end_time=model.end_time,
            show_short_description=model.show_short_description
        )
        
    def to_model(self) -> PotentialEvent:
        return PotentialEvent(
            id = self.id,
            club_id = self.club_id,
            name = self.name,
            description = self.description,
            location = self.location,
            start_time = self.start_time,
            end_time = self.end_time,
            show_short_description = self.show_short_description
        )
