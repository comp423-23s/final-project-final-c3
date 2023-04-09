from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from ..database import db_session
from ..models import Club, User
from ..entities import ClubEntity, UserEntity

class ClubService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session


    def get_all_clubs(self) -> list[Club]:
        """Returns all registered clubs in the database."""
        query = select(ClubEntity)
        club_entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in club_entities]
    

    def get_clubs_by_user_id(self, subject: User) -> list[Club]:
        """Returns all clubs that a user is a member of."""
        clubs: list[Club] = []
        query = select(user_club_table.c.club_id).where(user_club_table.c.user_id== subject.id)
        club_entites = self._session.scalars(query).all()
        for entity in club_entites:
            club_entity = self._session.get(ClubEntity, entity)
            clubs.append(club_entity.to_model())
        return clubs
    

    def add_user_to_club(self, subject: User, club_id: int) -> None:
        """Adds a user to a club.""" 
        club_entity = self._session.get(ClubEntity, club_id)
        user_entity = self._session.get(UserEntity, subject.id)
        if club_entity is None:
            raise Exception("Club does not exist.")
        if self.is_user_in_club(subject=subject, club_id=club_id):
            raise Exception("User is already in club.")
        club_entity.members.append(user_entity)
        self._session.commit()

   
    def is_user_in_club(self, subject: User, club_id: int) -> bool:
        club_entity = self._session.get(ClubEntity, club_id)
        club = club_entity.to_model()
        for member in club.members:
            if member.pid == subject.pid:
                return True
        return False
    
   
    def delete_user_from_club(self, subject: User, club_id: int) -> None:
        """"Deletes a user from a club."""
        club_entity = self._session.get(ClubEntity, club_id)
        user_entity = self._session.get(UserEntity, subject.id)
        if club_entity is None:
            raise Exception("Club does not exist.")
        if not self.is_user_in_club(subject=subject, club_id=club_id):
            raise Exception("User is not in club, cannot be removed.")
        club_entity.members.remove(user_entity)
        self._session.commit()
