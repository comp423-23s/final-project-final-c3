from fastapi import Depends
from sqlalchemy import text, select
from ..database import Session, db_session
from ..models import Club, User
from ..entities import ClubEntity

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
                
    
    def get_clubs_by_user(self, user_id: int) -> list[Club]:
        stmt = text('SELECT * FROM user_club WHERE user_id = :user_id')
        result = self._session.execute(stmt, {'id': user_id})
        return result
    
    def add_user_to_club(self, user: User, club: Club) -> None:
        members = club.members
        members.append(user)
        self._session.commit()
        
    
    def delete_user_from_club(self, user: User, club: Club) -> None:
        members = club.members
        members.remove(user)
        self._session.commit()
        self._session.flush()
    
    
    
    
              