from sqlalchemy import Table, Column, ForeignKey
from backend.entities.entity_base import EntityBase

user_role_table = Table(
    "user_role",
    EntityBase.metadata,
    Column('user_id', ForeignKey('user.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', ForeignKey('role.id', ondelete='CASCADE'), primary_key=True)
)
