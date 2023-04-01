from fastapi import Depends
from sqlalchemy import text, select
from ..database import Session, db_session
from ..models import Event, User
from ..entities import EventEntity, UserEntity
from ..services import UserService

class EventService:
    _session: Session
    
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
    
    def events_by_pid(self, pid: int) -> list[Event]:
        stmt = text('SELECT * FROM events WHERE user_id = :pid')
        result = self._session.execute(stmt, {'id': pid})
        return result
    
    def get_all_events(self) -> list[Event] | None:
        all_events = list[Event]
        query = select(EventEntity).all()
        event_entities: list[EventEntity] = self._session.scalar(query)
        if event_entities is None:
            return None
        else:
            for event in event_entities:
                model = event.to_model()
                all_events.append(model)
            return all_events
    
    def display_events_by_club_id(self, club_id: int) -> list[Event] | None:
        events = list[Event]
        query = select(EventEntity).where(EventEntity.club_id == club_id)
        event_entities: list[EventEntity] = self._session.scalar(query)
        if event_entities is None:
            return None
        else:
            for event in event_entities:
                model = event.to_model()
                events.append(model)
            return events
    
    def delete_event(self, event: Event) -> None:
        self._session.delete(event)
        self._session.commit()
        self._session.flush()
        
    def add_by_pid_to_event(self, pid: int, event: Event) -> None:
        attendees = event.attendees
        attendees.append(UserService.get(pid))
        
    def delete_by_pid_from_event(self, pid: int, event: Event) -> None:
        attendees = event.attendees
        attendees.remove(UserService.get(pid))
