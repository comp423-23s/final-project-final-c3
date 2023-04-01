from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.entities.entity_base import EntityBase
from backend.entities.user_entity import UserEntity
from backend.models.permission import Permission
from backend.entities.role_entity import RoleEntity


class PermissionEntity(EntityBase):
    __tablename__ = "permission"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    action: Mapped[str] = mapped_column(String)
    resource: Mapped[str] = mapped_column(String)

    role_id: Mapped[int] = mapped_column(ForeignKey('role.id'), nullable=True)
    role: Mapped[RoleEntity] = relationship(back_populates='permissions')

    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)
    user: Mapped[UserEntity] = relationship(back_populates='permissions')

    @classmethod
    def from_model(cls, model: Permission) -> Self:
        return cls(
            id=model.id,
            action=model.action,
            resource=model.resource
        )

    def to_model(self) -> Permission:
        return Permission(
            id=self.id,
            action=self.action,
            resource=self.resource
        )
