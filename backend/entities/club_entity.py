'''Club accounts for all registered clubs in the application.'''


from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from .user_entity import UserEntity
from ..models import Club
from .user_club_entity import user_club_table


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class ClubEntity(EntityBase):
    __tablename__ = 'clubs'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(
        String(100), nullable=False, default='')
    members: Mapped[list['UserEntity']] = relationship(secondary_table=user_club_table)


    @classmethod
    def from_model(cls, model: Club) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            description=model.description,
            members=model.members
        )

    def to_model(self) -> Club:
        return Club(
            id=self.id,
            name=self.name,
            description=self.description,
            members=self.members
        )

    def update(self, model: Club) -> None:
        self.name = model.name
        self.description = model.description
        self.members = model.members