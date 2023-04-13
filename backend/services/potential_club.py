from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from ..database import db_session
from ..models import Club, User, PotentialClub, Role
from ..entities import ClubEntity, UserEntity, PotentialClubEntity, RoleEntity
from random import random
import string

class PotentialClubService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def create_club(self, potential_club: PotentialClub) -> None:
        """Takes in a potential club and adds it to club table."""
        user_entity = self._session.get(UserEntity, potential_club.founder_id)
        #Creating the Club's initial list of members.

        members: list[User] = [user_entity]

        #Creating the Club's initial list of leaders.
        leaders: list[User] = [user_entity]

        # Create a random 
        characters = string.ascii_letters + string.digits
        club_code = ''.join(random.choice(characters) for i in range(8))

        # Creating the new Club
        new_club: Club = Club(club_code= club_code, name=potential_club.name, description=potential_club.description, members=members, leaders=leaders)

        #Adding the new role to the user's list of roles
        role_entity = self._session.get(RoleEntity, 2)
        user_entity.roles.append(role_entity)

        # Delete from PotentialClub table.
        potential_club_entity = PotentialClubEntity.from_model(potential_club)
        self._session.delete(potential_club_entity)

        # Add club to club table.
        club_entity = ClubEntity.from_model(new_club)
        self._session.add(club_entity)
        self._session.commit()
    
    def add_potential_club(self, potential_club: PotentialClub) -> None:
        potential_club_entity = PotentialClubEntity.from_model(potential_club)
        self._session.add(potential_club_entity)
        self._session.commit()

    def reject_potential_club(self, potential_club: PotentialClub) -> None:
        potential_club_entity = PotentialClubEntity.from_model(potential_club)
        self._session.delete(potential_club_entity)

    def get_all_requests(self) -> list[PotentialClub]:
        """Returns all potential clubs waiting for verification."""
        query = select(PotentialClubEntity)
        potential_club_entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in potential_club_entities]