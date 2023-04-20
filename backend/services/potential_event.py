from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import Event, User, PotentialEvent, Role
from ..entities import EventEntity, UserEntity, PotentialEventEntity
import string

class PotentialEventService:
    _session: Session
    id : int = -1
    
    def __init__(self, session: Session = Depends(db_session)):
        self._session = session
        
    def create_event(self, potential_event: PotentialEvent) -> None:
        """Takes in a potential event and adds it to event table."""
        new_event: Event = Event(club_id=potential_event.club_id, name=potential_event.name, description=potential_event.description, location=potential_event.location, start_time=potential_event.start_time, end_time=potential_event.end_time, show_short_description=potential_event.show_short_description)
        
        event_entity = EventEntity.from_model(new_event)
        self._session.add(event_entity)
        event_entity.event_id = self.generate_id()
        event_entity.attendees = []
        self._session.commit()
    
    def generate_id(self) -> int:
        self.id += 1
        return self.id
    
    def add_potential_event(self, potential_event: PotentialEvent) -> None:
        potential_event_entity = PotentialEventEntity.from_model(potential_event)
        self._session.add(potential_event_entity)
        self._session.commit()
        
    def get_all_potential_events(self) -> list[PotentialEvent]:
        """Returns all potential events"""
        query = select(PotentialEventEntity)
        potential_event_entities = self._session.scalars(query).all()
        return [entity.to_model() for entity in potential_event_entities]
        