from fastapi import Depends
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import Club, User
from ..entities import ClubEntity, UserEntity
from ..services import UserService

class ClubService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
        

    def get_all_clubs(self) -> list[Club]:
        """Returns all registered clubs in the database."""
        query = select(ClubEntity)
        club_entities = self._session.scalars(query).all()
        
        return [entity.to_model() for entity in club_entities]
    

    def get_clubs_by_pid(self, pid: int) -> list[Club]:
        """Returns all clubs that a user is a member of."""
        clubs: list[Club] = []
        query = select(ClubEntity)
        club_entities = self._session.scalars(query).all()
        if club_entities is None:
            return clubs
        else:
            for club in club_entities:
                for member in club.members:
                    if member.pid == pid:
                        model = club.to_model()
                        clubs.append(model)
            return clubs
    

    def add_user_to_club(self, subject: User, club_id: int) -> None:
        """Adds a user to a club.""" 
        # query = select(ClubEntity).where(ClubEntity.id == club_id)
        # club_entity = self._session.scalar(query)
        club_entity = self._session.get(ClubEntity, club_id)
        if club_entity is None:
            raise Exception("Club does not exist.")
        else:
            club = club_entity.to_model()
            members = club.members
            for member in members:
                if member.pid == subject.pid:
                    raise Exception("User already is a member of club.")
            members.append(subject)
            club_entity.update(club)
            self._session.flush()
            self._session.commit()

        
    def delete_user_from_club(self, subject: User, club_id: int) -> None:
        """"Deletes a user from a club."""
        query = select(ClubEntity).where(ClubEntity.id == club_id)
        club_entity = self._session.scalar(query)
        if club_entity is None:
            return Exception("Club does not exist.")
        else:
            club = club_entity.to_model()
            members = club.members
            members.remove(subject)
            club_entity.update(club)
            self._session.flush()
            self._session.commit()
