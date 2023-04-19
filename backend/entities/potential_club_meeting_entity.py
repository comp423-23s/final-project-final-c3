"""Stores the meeting times for potential clubs."""

from sqlalchemy import Table, Column, ForeignKey
from backend.entities.entity_base import EntityBase

potential_club_meeting_table = Table(
    "potential_club_meeting",
    EntityBase.metadata,
    Column('potential_club_id', ForeignKey('potential_club.id'), primary_key=True),
    Column('week_day_time_id', ForeignKey('week_day_time.id'), primary_key=True)
 )