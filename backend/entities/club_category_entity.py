"""A table that stores a clubs catagories."""

from sqlalchemy import Table, Column, ForeignKey, String
from backend.entities.entity_base import EntityBase

club_category_table = Table(
    "club_category",
    EntityBase.metadata,
    Column('club_id', ForeignKey('club.id', ondelete='CASCADE'), primary_key=True),
    Column('category', String)
)
