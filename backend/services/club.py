from typing import Tuple
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table
from backend.models.pagination import Paginated, PaginationParams
from ..database import db_session
from ..models import Club, User
from ..entities import ClubEntity, UserEntity, RoleEntity, WeekDayTimeEntity
from backend.entities.club_category_entity import club_category_table
from backend.entities.category_entity import CategoryEntity
from datetime import time, datetime


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
            print("🌶️ Leader successfully addeded in backend service")
        else:
            raise Exception("Club code does not match. Request denied.")
   
    def delete_user_from_club(self, subject: User, club_id: int) -> None:
        """"Deletes a user from a club."""
        club_entity = self._session.get(ClubEntity, club_id)
        user_entity = self._session.get(UserEntity, subject.id)
        club_entity.members.remove(user_entity)
        try: 
            club_entity.leaders.remove(user_entity)
            role_entity = self._session.get(RoleEntity, 2)
            user_entity.roles.remove(role_entity)
        except:
            print("User was not a leader.")
        self._session.commit()


    # Leader and Administrator Methods Below
    def get_members(self, club_id: int) -> list[User]:
        """Returns a list of members for a club."""
        members: list[User] = []
        query = select(user_club_table.c.user_id).where(user_club_table.c.club_id == club_id)
        user_ids = self._session.scalars(query).all()
        for an_id in user_ids:
            user_entity = self._session.get(UserEntity, an_id)
            members.append(user_entity.to_model())
        return members

   
    def get_leaders(self, club_id: int) -> list[User]:
        """Returns a list of leaders for a club."""
        leaders: list[User] = []
        query = select(leader_club_table.c.user_id).where(leader_club_table.c.club_id == club_id)
        user_ids = self._session.scalars(query).all()
        for an_id in user_ids:
            user_entity = self._session.get(UserEntity, an_id)
            leaders.append(user_entity.to_model())
        return leaders


    def get_club_name(self, club_id: int) -> str:
        """get club name by club id"""
        club_entity = self._session.get(ClubEntity, club_id)
        return club_entity.name
    

    def delete_club(self, club_id: int) -> None:
        """Deletes a club from the database."""
        club_entity = self._session.get(ClubEntity, club_id)
        self._session.delete(club_entity)
        self._session.commit()


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
        """Deletes a leader."""
        club_entity = self._session.get(ClubEntity, club_id)
        leader_as_user_entity = self._session.get(UserEntity, leader.id)
        club_entity.leaders.remove(leader_as_user_entity)


    def filter_by_availability(self, availabilities: list[Tuple[str, str]]) -> list[int]:
        """Returns a list of clubs that meet at the times specificed by the user."""
        final_club_ids: list[int] = []
        week_day_time_ids: list[int] = []
        morning_start: time = time(hour=6, minute=0)
        morning_end: time = time(hour=12, minute=0)
        afternoon_end: time = time(hour=17, minute=0)
        evening_end: time = time(hour=20, minute=0)
        for availability in availabilities:
            if availability[1] == "Morning":
                print("🏁" + "entered start")
                query = select(WeekDayTimeEntity).where(WeekDayTimeEntity.start_time >= morning_start, WeekDayTimeEntity.start_time < morning_end,
                        WeekDayTimeEntity.day == availability[0])
            if availability[1] == "Afternoon":
                query = select(WeekDayTimeEntity).where(WeekDayTimeEntity.start_time >= morning_end, WeekDayTimeEntity.start_time < afternoon_end, 
                          WeekDayTimeEntity.day == availability[0])
            if availability[1] == "Evening":
                print("🏁" + "entered evening")
                query = select(WeekDayTimeEntity).where(WeekDayTimeEntity.start_time >= afternoon_end, WeekDayTimeEntity.start_time < evening_end,
                          WeekDayTimeEntity.day == availability[0])
            week_day_time_entities = self._session.scalars(query).all()

            # Get WeekDayTimeEntity's id
            for week_day_time in week_day_time_entities:
                week_day_time_ids.append(week_day_time.id)

            # Select club_id based on WDT id
        for week_day_time_id in week_day_time_ids:
            query1 = select(WeekDayTimeEntity.club_id).where(WeekDayTimeEntity.id == week_day_time_id)
            club_ids = self._session.scalars(query1).all()
            for club_id in club_ids:
                final_club_ids.append(club_id)

        print("💄 length is " + str(len(final_club_ids)))
        return final_club_ids
    

    def filter_by_category(self, categories: list[str]) -> list[int]:
        """Gets a list of clubs based on a user's prefered interests."""
        final_club_ids: list[int] = []
        all_categories_ids: list[int] = []
        for category in categories:
            query = select(CategoryEntity.id).where(CategoryEntity.name == category)
            category_id = self._session.scalar(query)
            all_categories_ids.append(category_id)
        for category_id in all_categories_ids:
            query2 = select(club_category_table.c.club_id).where(club_category_table.c.category_id == category_id)
            club_ids = self._session.scalars(query2).all()
            for club_id in club_ids:
                final_club_ids.append(club_id)
        return final_club_ids
    

    def filter_by_availability_and_category(self, availabilities: list[Tuple[str, str]], categories: list[str]) -> list[Club]:
        """Filters by availability and category."""
        set_club_ids = set()
        clubs: list[Club] = []
        filtered_by_availability: list[int] = self.filter_by_availability(availabilities)
        filtered_by_categories: list[int] = self.filter_by_category(categories)
        for club_id_by_availability in filtered_by_availability:
            set_club_ids.add(club_id_by_availability)
        for club_id_by_category in filtered_by_categories:
            set_club_ids.add(club_id_by_category)
        
        for an_id in set_club_ids:
            club_entity = self._session.get(ClubEntity, an_id)
            clubs.append(club_entity.to_model())

        print('🚩 filter result number' + str(len(clubs)))
        return clubs
    