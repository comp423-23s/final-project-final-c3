
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from backend.models.role import Role
from backend.models.role_details import RoleDetails
from backend.entities.entity_base import EntityBase
from backend.entities.user_role_entity import user_role_table
from backend.entities.user_entity import UserEntity


class RoleEntity(EntityBase):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)

    users: Mapped[list['UserEntity']] = relationship(secondary=user_role_table, back_populates='roles')
    permissions: Mapped[list['PermissionEntity']] = relationship(back_populates='role')

    @classmethod
    def from_model(cls, model: Role) -> Self:
        return cls(
            id=model.id,
            name=model.name
        )

    def to_model(self) -> Role:
        return Role(
            id=self.id,
            name=self.name
        )

    def to_details_model(self) -> RoleDetails:
        return RoleDetails(
            id=self.id,
            name=self.name,
            permissions=[permission.to_model() for permission in self.permissions],
            users=[user.to_model() for user in self.users]
        )
    
# Must put dependent classes at the top and bottom to avoid circular issue.
from backend.entities.permission_entity import PermissionEntity
