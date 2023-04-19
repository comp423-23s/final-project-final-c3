'''Club accounts for all registered clubs in the application.'''


from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.club import Club
from backend.entities.entity_base import EntityBase
from backend.entities.user_entity import UserEntity
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table
from backend.entities.club_meeting_entity import club_meeting_table
from backend.entities.club_category_entity import club_category_table


__authors__ = ['Aryonna Rice']
__copyright__ = 'Copyright 2023'
__license__ = 'MIT'


class ClubEntity(EntityBase):
    __tablename__ = 'club'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    club_code: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(
        String(64), nullable=False, default='')
    description: Mapped[str] = mapped_column(
        String(100), nullable=False, default='')
    members: Mapped[list['UserEntity']] = relationship(secondary=user_club_table, back_populates="clubs")
    leaders: Mapped[list['UserEntity']] = relationship(secondary=leader_club_table)
    meeting_times: Mapped[list['WeekDayTimeEntity']] = relationship(secondary= club_meeting_table, cascade="all, delete-orphan")
    categories: Mapped[list[str]] = relationship(secondary=club_category_table, cascade="all, delete-orphan")

    @classmethod
    def from_model(cls, model: Club) -> Self:
        return cls(
            id=model.id,
            club_code=model.club_code,
            name=model.name,
            description=model.description,
            members = [UserEntity.from_model(member) for member in model.members],
            leaders = [UserEntity.from_model(leader) for leader in model.leaders],
            meeting_times = [WeekDayTimeEntity.from_model(week_day_time) for week_day_time in model.meeting_times],
            categories = model.categories
        )

    def to_model(self) -> Club:
        return Club(
            id=self.id,
            club_code=self.club_code,
            name=self.name,
            description=self.description,
            members = [member.to_model() for member in self.members],
            leaders = [leader.to_model() for leader in self.leaders],
            meeting_times = [WeekDayTimeEntity.from_model(week_day_time) for week_day_time in self.meeting_times],
            categories= self.categories
        )

    def update(self, model: Club) -> None:
        self.name = model.name
        self.description = model.description

    def add_member(self, user: UserEntity) -> None:
        self.members.append(user)


from backend.entities.week_day_time_entity import WeekDayTimeEntity