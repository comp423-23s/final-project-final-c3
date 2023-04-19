"""Stores that categories of potential clubs."""

from sqlalchemy import Table, Column, ForeignKey, String
from backend.entities.entity_base import EntityBase

potential_club_category_table = Table(
    "potential_club_category",
    EntityBase.metadata,
    Column('potential_club_id', ForeignKey('potential_club.id', ondelete='CASCADE'), primary_key=True),
    Column('category', String)
)
