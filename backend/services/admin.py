from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table

from ..database import db_session
from ..models import Club, User, PotentialClub
from ..entities import ClubEntity, UserEntity, RoleEntity, PotentialClubEntity

class AdminService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def add_admin(self, pid: int) -> None:
        query = select(UserEntity).where(UserEntity.pid == pid)
        user_entity = self._session.scalar(query).all()
        role_entity = self._session.get(RoleEntity, 3)
        user_entity.roles.append(role_entity)
        self._session.commit()
