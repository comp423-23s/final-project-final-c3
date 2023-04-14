'''PotentialClub accounts for all registered clubs in the application.'''

from sqlalchemy import Integer, String, insert, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.potential_club import PotentialClub
from backend.entities.entity_base import EntityBase
from backend.entities.user_entity import UserEntity
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table


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

    @classmethod
    def from_model(cls, model: PotentialClub) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            description=model.description,
            founder_id=model.founder_id
        )

    def to_model(self) -> PotentialClub:
        return PotentialClub(
            id=self.id,
            name=self.name,
            description=self.description,
            founder_id=self.founder_id
        )