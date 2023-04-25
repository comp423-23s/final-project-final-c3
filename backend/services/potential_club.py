from fastapi import Depends
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from ..database import db_session
from ..models import Club, User, PotentialClub, Role
from ..entities import ClubEntity, UserEntity, PotentialClubEntity, RoleEntity, CategoryEntity, WeekDayTimeEntity
import random
import string

class PotentialClubService:
    _session: Session

    def __init__(self, session: Session = Depends(db_session)):
        self._session = session

    def create_club(self, potential_club: PotentialClub) -> None:
        """Takes in a potential club and adds it to club table."""
        user_entity = self._session.get(UserEntity, potential_club.founder_id)
        print("🥏 founder id is " + str(potential_club.founder_id))
        #Creating the Club's initial list of members.

        # Create a random 
        characters = string.ascii_letters + string.digits
        club_code = ''.join(random.choice(characters) for i in range(8))

        # Creating the new Club
        new_club: Club = Club(club_code= club_code, name=potential_club.name, description=potential_club.description)

        #Adding the new role to the user's list of roles
        role_entity = self._session.get(RoleEntity, 2)
        user_entity.roles.append(role_entity)

        # Add club to club table.
        club_entity = ClubEntity.from_model(new_club)
        self._session.add(club_entity)
        club_entity.members.append(user_entity)
        club_entity.leaders.append(user_entity)

        # Add categories to club's category list
        for category in potential_club.categories:
            print("🦾" + str(category.id))
            category_entity = self._session.get(CategoryEntity, category.id)
            club_entity.categories.append(category_entity)

        # Get PotentialClubEntity for information
        potential_club_entity = self._session.get(PotentialClubEntity, potential_club.id)
    

        # Add the weekdaytimeentities from the potential club's list of WDT to real club's list of WDT
        for week_day_time_entity in potential_club_entity.meeting_times:
            club_entity.meeting_times.append(week_day_time_entity)

        stmt = delete(WeekDayTimeEntity).where(WeekDayTimeEntity.potential_club_id == potential_club.id)
        # Safely delete PotentialClubEntity
        self._session.delete(potential_club_entity)
        self._session.commit()
    
    

    def add_potential_club(self, potential_club: PotentialClub) -> None:
        print("⛳️ services/potential_club.py backend add_potential_club called")
        potential_club_entity = PotentialClubEntity.from_model(potential_club)
        self._session.add(potential_club_entity)
        for category in potential_club.categories:
            print("🦾" + str(category.id))
            category_entity = self._session.get(CategoryEntity, category.id)
            potential_club_entity.categories.append(category_entity)
        self._session.commit()

    def reject_potential_club(self, potential_club: PotentialClub) -> None:
        potential_club_entity = self._session.get(PotentialClubEntity, potential_club.id)
        stmt = delete(WeekDayTimeEntity).where(WeekDayTimeEntity.potential_club_id == potential_club.id)
        self._session.delete(potential_club_entity)
        self._session.commit()

    def get_all_requests(self) -> list[PotentialClub]:
        """Returns all potential clubs waiting for verification."""
        query = select(PotentialClubEntity)
        potential_club_entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in potential_club_entities]