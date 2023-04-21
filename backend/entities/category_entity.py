from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.entities.entity_base import EntityBase
from backend.models.category import Category
from typing import Self


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'

class CategoryEntity(EntityBase):
    __tablename__ = 'category'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    clubs: Mapped[list['ClubEntity']] = relationship(secondary='club_category', back_populates="categories")
    potential_clubs: Mapped[list['PotentialClubEntity']] = relationship(secondary='potential_club_category', back_populates="categories")

    @classmethod
    def from_model(cls, model: Category) -> Self:
        return cls(
            id=model.id,
            name=model.name
        )

    def to_model(self) -> Category:
        return Category(
            id=self.id,
            name=self.name
        )
    

from backend.entities.club_entity import ClubEntity
from backend.entities.potential_club_entity import PotentialClubEntity