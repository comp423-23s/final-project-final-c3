from fastapi import Depends
from sqlalchemy import text, select
from ..database import Session, db_session
from ..models import Club, User
from ..entities import ClubEntity, UserEntity
from ..services import UserService

class ClubService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
              
    def get_all_clubs(self) -> list[Club]:
        all_clubs = list[Club]
        query = select(ClubEntity).all()
        club_entities: list[ClubEntity] = self._session.scalar(query)
        if club_entities is None:
            return None
        else:
            for club in club_entities:
                model = club.to_model()
                all_clubs.append(model)
            return all_clubs
                
    
    def get_clubs_by_pid(self, pid: int) -> list[Club]:
        clubs = list[Club]
        query = select(ClubEntity).all()
        club_entities: list[ClubEntity] = self._session.scalar(query)
        if club_entities is None:
            return None
        else:
            for club in club_entities:
                for member in club.members:
                    if member.pid == pid:
                        model = club.to_model()
                        clubs.append(model)
            return clubs
    
    def add_user_to_club(self, pid: int, club: Club) -> None:
        user = UserService.get(pid)
        club.members.append(user)
        self._session.commit()
        self._session.flush()
    
    def delete_user_from_club(self, pid: int, club: Club) -> None:
        user = UserService.get(pid)
        club.members.remove(user)
        self._session.commit()
        self._session.flush()
    
    
    
    
              