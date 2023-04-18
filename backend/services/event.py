from fastapi import Depends
from sqlalchemy import select

from ..database import Session, db_session
from ..models import Event, User
from ..entities import EventEntity, UserEntity
from ..services import UserService
from backend.entities.user_event_entity import user_event_table


class EventService:
    _session: Session
    
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
     
    def get_all_events(self) -> list[Event]:
        """Get all registered events in the database."""
        query = select(EventEntity)
        print('Event service: after query')
        event_entities = self._session.scalars(query).all()
        print('Event service: after scalars method')
        return [entity.to_model() for entity in event_entities]
    

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
        
        
    def get_events_by_club_id(self, club_id: int) -> list[Event]:
        """Returns a list of all events the club has registered."""
        events: list[Event] = []
        query = select(EventEntity).where(EventEntity.club_id == club_id)
        event_entities: list[EventEntity] = self._session.scalar(query)
        if event_entities is None:
            return events
        else:
            for event in event_entities:
                model = event.to_model()
                events.append(model)
            return events


# CLUB LEADER METHODS
    def create_event(self, event: Event) -> None:
        """Creates a new event."""
        event_entity = EventEntity.from_model(event)
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
        """Returns a club id when given a club_code"""
        query = select(EventEntity).where(EventEntity.club_code == club_code)
        event_entity: EventEntity = self._session.scalar(query)
        if event_entity is None:
            raise Exception("Event does not exist.")
        return event_entity.club_id