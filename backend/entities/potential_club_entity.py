'''PotentialClub accounts for all registered clubs in the application.'''

from sqlalchemy import Integer, String, insert, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.potential_club import PotentialClub
from backend.entities.entity_base import EntityBase
from backend.entities.potential_club_category_entity import potential_club_category_table


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class PotentialClubEntity(EntityBase):
    __tablename__ = 'potential_club'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(
        String(100), nullable=False, default='')
    founder_id: Mapped[int] = mapped_column(Integer, nullable=True)
    meeting_times: Mapped[list['WeekDayTimeEntity']] = relationship(back_populates="potential_club", cascade="all, delete-orphan")
    categories: Mapped[list['CategoryEntity']] = relationship(secondary=potential_club_category_table, back_populates="potential_clubs")

    @classmethod
    def from_model(cls, model: PotentialClub) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            description=model.description,
            founder_id=model.founder_id,
            meeting_times = [WeekDayTimeEntity.from_model(week_day_time) for week_day_time in model.meeting_times]
            # categories = [CategoryEntity.from_model(category) for category in model.categories]
        )

    def to_model(self) -> PotentialClub:
        return PotentialClub(
            id=self.id,
            name=self.name,
            description=self.description,
            founder_id=self.founder_id,
            meeting_times = [week_day_time.to_model() for week_day_time in self.meeting_times],
            categories = [category.to_model() for category in self.categories]
        )
    
from backend.entities.week_day_time_entity import WeekDayTimeEntity
from backend.entities.category_entity import CategoryEntity