"""Definitions of SQLAlchemy table-backed object mappings called entities."""


from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from typing import Self
from models import User


class Base(DeclarativeBase):
    pass


class UserEntity(Base):
    __tablename__ = "users"

    pid: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String(64))
    last_name: Mapped[str] = mapped_column(String(64))

    @classmethod
    def from_model(cls, model: User) -> Self:
        return cls(pid=model.pid, first_name=model.first_name, last_name=model.last_name)

    def to_model(self) -> User:
        return User(pid=self.pid, first_name=self.first_name, last_name=self.last_name)
