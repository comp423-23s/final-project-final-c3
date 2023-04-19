from sqlalchemy import Table, Column, ForeignKey
from backend.entities.entity_base import EntityBase

leader_club_table = Table(
    "leader_club",
    EntityBase.metadata,
    Column('user_id', ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
    Column('club_id', ForeignKey('club.id', ondelete='CASCADE'), primary_key=True)
)
