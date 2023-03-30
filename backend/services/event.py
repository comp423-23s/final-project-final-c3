from fastapi import Depends
from sqlalchemy import text, select
from ..database import Session, db_session
from ..models import Event, User
from ..entities import EventEntity

class EventService:
    _session: Session
    
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
    
    def event_by_user(self, user_id: int) -> list[Event]:
        stmt = text('SELECT * FROM events WHERE user_id = :id')
        result = self._session.execute(stmt, {'id': user_id})
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
    
    
    def delete_event(self, event: Event, event_id: int) -> None:
        self._session.delete(event)
        self._session.commit()
        self._session.flush()