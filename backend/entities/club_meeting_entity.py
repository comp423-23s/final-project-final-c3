from sqlalchemy import Integer, Table, Column, ForeignKey
from backend.entities.entity_base import EntityBase

club_meeting_table = Table(
    "club_meeting",
    EntityBase.metadata,
    Column('club_id', ForeignKey('club.id', ondelete='CASCADE'), primary_key=True),
    Column('week_day_time_id', ForeignKey('week_day_time.id', ondelete='CASCADE'), primary_key=True)
 )