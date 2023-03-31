from sqlalchemy import Table, Column, ForeignKey
from backend.entities.entity_base import EntityBase

user_event_table = Table(
    "user_event",
    EntityBase.metadata,
    Column('user_id', ForeignKey('user.id'), primary_key=True),
    Column('event_id', ForeignKey('event.id'), primary_key=True)
)