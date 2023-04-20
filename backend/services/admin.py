from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_role_entity import user_role_table
from ..database import db_session
from ..models import User
from ..entities import ClubEntity, UserEntity, RoleEntity

class AdminService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def add_admin(self, pid: int) -> None:
        """Adds the admin title to the user."""
        query = select(UserEntity).where(UserEntity.pid == pid)
        user_entity = self._session.scalar(query).all()
        role_entity = self._session.get(RoleEntity, 3)
        user_entity.roles.append(role_entity)
        self._session.commit()

    def delete_admin(self, pid: int) -> None:
        """Removes the admin role from a user. """
        query = select(UserEntity).where(UserEntity.pid == pid)
        user_entity = self._session.scalar(query).all()
        role_entity = self._session.get(RoleEntity, 3)
        user_entity.roles.remove(role_entity)
        self._session.commit()

    def delete_club(self, club_id: int) -> None:
        """Deletes a club from the database."""
        club_entity = self._session.get(ClubEntity, club_id)
        self._session.delete(club_entity)
        self._session.commit()
        
    def delete_leader(self, leader_pid: int, club_id: int) -> None:
        """Deletes a leader."""
        club_entity = self._session.get(ClubEntity, club_id)
        query = select(UserEntity).where(UserEntity.pid == leader_pid)
        leader_as_user_entity = self._session.scalars(query).all()
        club_entity.leaders.remove(leader_as_user_entity)
        role_entity = self._session.get(RoleEntity, 2)
        leader_as_user_entity.roles.remove(role_entity)

    def get_all_users(self) -> list[User]:
        """Returns a list of all users in the database."""
        query = select(UserEntity)
        user_entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in user_entities]
    
    def get_all_admin(self) -> list[User]:
        """Returns a list of all administrators."""
        print("We got to backend services for admin")
        admins: list[User] = []
        query = select(user_role_table.c.user_id).where(user_role_table.c.role_id == 3)
        admin_ids = self._session.scalars(query).all()
        for an_id in admin_ids:
            user_entity = self._session.get(UserEntity, an_id)
            admins.append(user_entity.to_model())
        return admins

    def get_leaders_of_a_club(self, club_id: int) -> list[User]:
        """Returns a list of all the leaders of a specific club."""
        club_entity = self._session.get(ClubEntity, club_id)
        return [leader.to_model() for leader in club_entity.leaders]
    
    def get_all_leaders(self) -> list[User]:
        """Returns a list of all leaders."""
        leaders: list[User] = []
        query = select(user_role_table.c.user_id).where(user_role_table.c.role_id == 2)
        leader_ids = self._session.scalars(query).all()
        for an_id in leader_ids:
            user_entity = self._session.get(UserEntity, an_id)
            leaders.append(user_entity.to_model())
        return leaders