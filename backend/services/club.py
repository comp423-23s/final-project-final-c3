from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table

from ..database import db_session
from ..models import Club, User
from ..entities import ClubEntity, UserEntity, RoleEntity

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
        query = select(user_club_table.c.club_id).where(user_club_table.c.user_id == subject.id)
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
        """States whether or not a user is in a club."""
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


    # Leader Methods Below
    def get_members(self, club_id: int) -> list[User]:
        """Returns a list of members for a club."""
        members: list[User] = []
        query = select(user_club_table.c.user_id).where(user_club_table.c.club_id== club_id)
        user_entites = self._session.scalars(query).all()
        for entity in user_entites:
            user_entity = self._session.get(UserEntity, entity)
            members.append(user_entity.to_model())
        return members
    

    def delete_club(self, club_id: int) -> None:
        """Deletes a club from the database."""
        club_entity = self._session.get(ClubEntity, club_id)
        self._session.delete(club_entity)
        self._session.commit()


    def add_leader(self, potential_leader: User, club_id: int, given_club_code: str) -> None:
        """Adds a leader to an existing club."""
        club_entity = self._session.get(ClubEntity, club_id)
        actual_club_code = club_entity.club_code
        if (given_club_code == actual_club_code):
            leader_as_user_entity = self._session.get(UserEntity, potential_leader.id)
            club_entity.members.append(leader_as_user_entity)
            club_entity.leaders.append(leader_as_user_entity)
            role_entity = self._session.get(RoleEntity, 2)
            leader_as_user_entity.roles.append(role_entity)
            self._session.commit()
            print("🌶️ Leader successfully addede in backend service")
        else:
            raise Exception("Club code does not match. Request denied.")
        
    def get_clubs_led_by_user(self, leader: User) -> list[Club]:
        """Returns a list of all the clubs a user is leading."""
        clubs: list[Club] = []
        query = select(leader_club_table.c.club_id).where(leader_club_table.c.user_id == leader.id)
        club_entities = self._session.scalars(query).all()
        for club_id in club_entities:
            club_entity = self._session.get(ClubEntity, club_id)
            clubs.append(club_entity.to_model())
        print("⚽️ LEADING")
        for club in clubs: 
            print("🏓 I am leading" + club.name)
        print("🏓" + str(len(clubs)))
        return clubs

    def delete_leader(self, leader: User, club_id) -> None:
        club_entity = self._session.get(ClubEntity, club_id)
        leader_as_user_entity = self._session.get(UserEntity, leader.id)
        club_entity.leaders.remove(leader_as_user_entity)



        



