from fastapi import Depends
from sqlalchemy import select
from database import Session, db_session
from models import Event
from entities import EventEntity, ClubEntity
from services import UserService

class EventService:
    _session: Session
    
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
    
    def events_by_pid(self, pid: int) -> list[Event]:
        """Get events user has registered for by user's pid."""
        events: list[Event] = []
        query = select(EventEntity).where(EventEntity.name != "None")
        event_entities: list[ClubEntity] = self._session.scalar(query)
        if event_entities is None:
            return events
        else:
            for event in event_entities:
                for attendee in event.attendees:
                    if attendee.pid == pid:
                        model = event.to_model()
                        events.append(model)
            return events
    
    def get_all_events(self) -> list[Event]:
        """Get all registered events in the database."""
        all_events: list[Event] = []
        query = select(EventEntity).where(EventEntity.name != "None")
        event_entities: list[EventEntity] = self._session.scalar(query)
        if event_entities is None:
            return all_events
        else:
            for event in event_entities:
                model = event.to_model()
                all_events.append(model)
            return all_events
    
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
    
    def delete_event(self, event_id: int) -> None:
        """Deletes an event."""
        query = select(EventEntity).wehre(EventEntity.id == event_id)
        event_entity: EventEntity = self._session.scalar(query)
        if event_entity is None:
            raise Exception("Event does not exist.")
        self._session.delete(event_entity.to_model())
        self._session.commit()
        self._session.flush()
        
    def add_by_pid_to_event(self, pid: int, event_id: int) -> None:
        """Add a user to an event."""
        query = select(EventEntity).where(EventEntity.id == event_id)
        event_entity: EventEntity = self._session.scalar(query)
        if event_entity is None:
            raise Exception("Event does not exist.")
        else:
            event = event_entity.to_model()
            attendees = event.attendees
            for attendee in attendees:
                if attendee.pid == pid:
                    raise Exception("User is already registered for this event.")
            attendees.append(UserService.get(pid))
            event_entity.update(event)
            self._session.commit()
            self._session.flush()
        
    def delete_by_pid_from_event(self, pid: int, event_id: int) -> None:
        """Degregister a user from an event."""
        query = select(EventEntity).where(EventEntity.id == event_id)
        event_entity: EventEntity = self._session.scalar(query)
        if event_entity is None:
            raise Exception("Event does not exist.")
        else:
            event = event_entity.to_model()
            attendees = event.attendees
            for attendee in attendees:
                if attendee.pid == pid:
                    attendees.remove(attendee)
                    event_entity.update(attendee)
                    self._session.commit()
                    self._session.flush()
                    return 
            raise Exception("User not registered for this event")
    
