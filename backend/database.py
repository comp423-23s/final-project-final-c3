"""SQLAlchemy DB Engine and Session niceties for FastAPI dependency injection."""

import sqlalchemy
from sqlalchemy.orm import Session
from backend.entities.club_entity import ClubEntity

from backend.models.club import Club
from .env import getenv

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


def _engine_str(database=getenv("POSTGRES_DATABASE")) -> str:
    """Helper function for reading settings from environment variables to produce connection string."""
    dialect = "postgresql+psycopg2"
    user = getenv("POSTGRES_USER")
    password = getenv("POSTGRES_PASSWORD")
    host = getenv("POSTGRES_HOST")
    port = getenv("POSTGRES_PORT")
    return f"{dialect}://{user}:{password}@{host}:{port}/{database}"


engine = sqlalchemy.create_engine(_engine_str(), echo=True)
"""Application-level SQLAlchemy database engine."""


def db_session():
    """Generator function offering dependency injection of SQLAlchemy Sessions."""
    session = Session(engine)
    try:
        # club_a: ClubEntity = ClubEntity(id=1, name="Club101", description="A club called Club101.")
        # session.add(club_a)
        # club_b: ClubEntity = ClubEntity(id=2, name="Club102", description="A club called Club102.")
        # session.add(club_b)
        # club_c: ClubEntity = ClubEntity(id=3, name="Club103", description="A club called Club103.")
        # session.add(club_c)
        # club_d: ClubEntity = ClubEntity(id=4, name="Club104", description="A club called Club104.")
        # session.add(club_d)
        # club_e: ClubEntity = ClubEntity(id=5, name="Club105", description="A club called Club105.")
        # session.add(club_e)
        # session.flush()
        # session.commit()
        yield session
    finally:
        session.close()
