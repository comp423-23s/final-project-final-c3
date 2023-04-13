from fastapi import Depends
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import User, Role, RoleDetails, Permission
from ..entities import RoleEntity, PermissionEntity, UserEntity
from .permission import PermissionService, UserPermissionError
from backend.entities.user_role_entity import user_role_table


class RoleService:

    def __init__(self, session: Session = Depends(db_session), permission: PermissionService = Depends()):
        self._session = session
        self._permission = permission

    def my_list(self, subject: User) -> list[Role]:
        """Only returns a list of all the roles, nothing further."""
        self._permission.enforce(subject, 'role.list', 'role/')
        stmt = select(RoleEntity).order_by(RoleEntity.name)
        role_entities = self._session.execute(stmt).scalars()
        return [role_entity.to_model() for role_entity in role_entities]

    def details(self, subject: User, id: int) -> RoleDetails:
        self._permission.enforce(subject, 'role.details', f'role/{id}')
        role = self._session.get(RoleEntity, id)
        return role.to_details_model()

    def grant(self, subject: User, id: int, permission: Permission):
        self._permission.enforce(subject, 'role.grant_permission', f'role/{id}')
        role = self.details(subject, id)
        self._permission.grant(subject, role, permission)
        return self.details(subject, id)

    def revoke(self, subject: User, id: int, permissionId: int):
        self._permission.enforce(subject, 'role.revoke_permission', f'role/{id}')
        role = self._session.get(RoleEntity, id)
        permission = self._session.get(PermissionEntity, permissionId)
        assert role is permission.role
        self._session.delete(permission)
        self._session.commit()
        return True

    def add(self, subject: User, id: int, member: User):
        self._permission.enforce(subject, 'role.add_member', f'role/{id}')
        role = self._session.get(RoleEntity, id)
        user = self._session.get(UserEntity, member.id)
        if user:
            role.users.append(user)
            self._session.commit()
        return self.details(subject, id)

    def remove(self, subject: User, id: int, userId: int):
        self._permission.enforce(subject, 'role.remove_member', f'role/{id}')
        role = self._session.get(RoleEntity, id)
        user = self._session.get(UserEntity, userId)
        role.users.remove(user)
        self._session.commit()
        return True
    
    def get_users_roles(self, subject: User) -> list[Role]:
        """Gets a users list of roles."""
        roles: list[Role] = []
        query = select(user_role_table.c.role_id).where(user_role_table.c.user_id== subject.id)
        role_ids = self._session.scalars(query).all()
        for entity in role_ids:
            role_entity = self._session.get(RoleEntity, entity)
            roles.append(role_entity.to_model())
        return roles