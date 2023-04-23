from fastapi import Depends
from sqlalchemy import select

from ..database import Session, db_session
from ..models import Event, User, Club
from ..entities import EventEntity, UserEntity, ClubEntity
from ..services import ClubService
from backend.entities.user_event_entity import user_event_table
from backend.entities.user_club_entity import user_club_table
from backend.entities.leader_club_entity import leader_club_table

class EventService:
    _session: Session
    _club: ClubService
    
    def __init__(self, session: Session = Depends(db_session), club: ClubService = Depends()):
        self._session = session
        self._club = club
     
    def get_all_events(self) -> list[Event]:
        """Get all registered events in the database."""
        events = []
        query = select(EventEntity)
        print('Event service: after query')
        event_entities = self._session.scalars(query).all()
        print('Event service: after scalars method')
        for entity in event_entities:
            events.append(entity.to_model())
        for event in events:
            event.show_short_description = True
            print(event)
        return events
    

# STUDENT METHODS

    def events_by_user(self, subject: User) -> list[Event]:
        """Get events user has registered for by user's pid."""
        events: list[Event] = []
        query = select(user_event_table.c.event_id).where(user_event_table.c.user_id == subject.id)
        event_entities = self._session.scalars(query).all()
        for entity in event_entities:
            event_entity = self._session.get(EventEntity, entity)
            events.append(event_entity.to_model())
        return events
        

    def add_user_to_event(self, subject: User, event_id: int) -> None:
        """Add a user to an event."""
        event_entity = self._session.get(EventEntity, event_id)
        user_entity = self._session.get(UserEntity, subject.id)
        if event_entity is None:
            raise Exception("Event does not exist.")
        if self.is_user_registered(subject, event_id):
            raise Exception("User is already registered for this event.")
        if user_entity is not None:
            event_entity.attendees.append(user_entity)
        else:
            raise Exception("User does not exist.")
        self._session.commit()
        

    def delete_user_from_event(self, subject: User, event_id: int) -> None:
        """Degregister a user from an event."""
        event_entity = self._session.get(EventEntity, event_id)
        user_entity = self._session.get(UserEntity, subject.id)
        if event_entity is None:
            raise Exception("Event does not exist.")
        if not self.is_user_registered(subject=subject, event_id=event_id):
            raise Exception("User is not registered for this event.")
        event_entity.attendees.remove(user_entity)
        self._session.commit()
    
    
    def is_user_registered(self, subject: User, event_id: int) -> bool:
        """Returns True if the user is registered for the event."""
        event_entity = self._session.get(EventEntity, event_id)
        event = event_entity.to_model()
        for attendee in event.attendees:
            if attendee.pid == subject.pid:
                return True
            return False


# CLUB LEADER METHODS
    def create_event(self, event: Event) -> None:
        """Creates a new event."""
        print("We got to backend/services/create_event")
        event_entity = EventEntity.from_model(event)
        print(str(event_entity.id))
        print(str(event.id))
        self._session.add(event_entity)
        self._session.commit()

    def delete_event(self, event_id: int) -> None:
        """Deletes an event."""
        event_entity = self._session.get(EventEntity, event_id)
        self._session.delete(event_entity)
        self._session.commit()
        
    def get_users_in_event(self, event_id: int) -> list[User]:
        """Returns a list of all students registered for an event."""
        students: list[User] = []
        query = select(EventEntity).where(EventEntity.id == event_id)
        event_entity: EventEntity = self._session.scalar(query)
        if event_entity is None:
            raise Exception("Event does not exist.")
        for attendee in event_entity.attendees:
            students.append(attendee.to_model())
        return students
    
    def get_club_id_from_code(self, club_code: str) -> int:
        query = select(ClubEntity.id).where(ClubEntity.club_code == club_code)
        club_id = self._session.scalar(query)
        print("CLUB ID IZZ" + str(club_id))
        return club_id

    def events_by_user(self, subject: User) -> list[Event]:
        """Get events user has registered for that are in their clubs"""
        events: list[Event] = []
        events_query = select(user_event_table.c.event_id).where(user_event_table.c.user_id == subject.id)
        event_ids = self._session.scalars(events_query).all()
        for event_id in event_ids:
            event_entity = self._session.get(EventEntity, event_id)
            events.append(event_entity.to_model())
        return events
    
    def events_by_leader(self, subject:User) -> list[Event]:
        """Gets events by the leader's clubs"""
        events: list[Event] = []
        leaders_clubs = self._club.get_clubs_led_by_user(subject)
        for club in leaders_clubs:
            print("this leader's club id is:" + str(club.id))
            club_events = self.get_events_by_club_id(club.id)
            for event in club_events:
                events.append(event)
        return events
    
    def get_clubs_by_leader(self, subject: User) -> list[Club]:
        clubs = []
        clubs_query = select(leader_club_table.c.club_id).where(leader_club_table.c.user_id == subject.id)
        club_ids = self._session.scalars(clubs_query).all()
        if club_ids is None:
            raise Exception("User is not a leader of any clubs.")
        for an_id in club_ids:
            club = self.get_club_by_id(an_id)
            clubs.append(club)
        return clubs
    
    def get_club_by_id(self, club_id: int) -> Club:
        query = select(ClubEntity).where(ClubEntity.id == club_id)
        club_entity: ClubEntity = self._session.scalar(query)
        if club_entity is None:
            raise Exception("Club does not exist.")
        return club_entity.to_model()
    
    def get_events_by_club_id(self, club_id: int) -> list[Event]:
        """Returns a list of all events the club has registered."""
        print("ENETEREDDD")
        events: list[Event] = []
        query = select(EventEntity).where(EventEntity.club_id == club_id)
        event_entities = self._session.scalars(query).all()
        for event in event_entities:
            events.append(event.to_model())
            print("EVENT ID IS:" + str(event.id))
        print(str(len(event_entities)))
        return events
    