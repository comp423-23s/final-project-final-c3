"""Reset the database by dropping all tables, creating tables, and inserting demo data."""

import sys
import datetime
from sqlalchemy import text
from sqlalchemy.orm import Session
from ..database import engine
from ..env import getenv
from .. import entities
from backend.entities.club_entity import ClubEntity
from backend.entities.event_entity import EventEntity

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


if getenv("MODE") != "development":
    print("This script can only be run in development mode.", file=sys.stderr)
    print("Add MODE=development to your .env file in workspace's `backend/` directory")
    exit(1)


# Reset Tables
entities.EntityBase.metadata.drop_all(engine)
entities.EntityBase.metadata.create_all(engine)


# Insert Dev Data from `script.dev_data`

# Add Users
with Session(engine) as session:
    from .dev_data import users
    to_entity = entities.UserEntity.from_model
    session.add_all([to_entity(model) for model in users.models])
    session.execute(text(f'ALTER SEQUENCE {entities.UserEntity.__table__}_id_seq RESTART WITH {len(users.models) + 1}'))
    session.commit()

# Add Roles
with Session(engine) as session:
    from .dev_data import roles
    to_entity = entities.RoleEntity.from_model
    session.add_all([to_entity(model) for model in roles.models])
    session.execute(text(f'ALTER SEQUENCE {entities.RoleEntity.__table__}_id_seq RESTART WITH {len(roles.models) + 1}'))
    session.commit()

# Add Users to Roles
with Session(engine) as session:
    from ..entities import UserEntity, RoleEntity
    from .dev_data import user_roles
    for user, role in user_roles.pairs:
        user_entity = session.get(UserEntity, user.id)
        role_entity = session.get(RoleEntity, role.id)
        user_entity.roles.append(role_entity)
    session.commit()

# Add Permissions to Users/Roles
with Session(engine) as session:
    from ..entities import PermissionEntity
    from .dev_data import permissions
    for role, permission in permissions.pairs:
        entity = PermissionEntity.from_model(permission)
        entity.role = session.get(RoleEntity, role.id)
        session.add(entity)
    session.execute(text(f'ALTER SEQUENCE permission_id_seq RESTART WITH {len(permissions.pairs) + 1}'))
    session.commit()

# Add Fake Data to Display
with Session(engine) as session:
    # Fake Clubs.
    club_a: ClubEntity = ClubEntity(id=1, name="Club101", description="A club called Club101.")
    session.add(club_a)
    club_b: ClubEntity = ClubEntity(id=2, name="Club102", description="A club called Club102.")
    session.add(club_b)
    club_c: ClubEntity = ClubEntity(id=3, name="Club103", description="A club called Club103.")
    session.add(club_c)
    club_d: ClubEntity = ClubEntity(id=4, name="Club104", description="A club called Club104.")
    session.add(club_d)
    club_e: ClubEntity = ClubEntity(id=5, name="Club105", description="A club called Club105.")
    session.add(club_e)

    #Fake Events
    event_a_date = datetime.datetime(year=2023, month=4, day=3, hour=5, minute=0)
    event_a: EventEntity = EventEntity(id=1, name="Event101", club_id=1, date=event_a_date, location="123 Main Street, Chapel Hill NC", description="A club called Club101.", attendees=[])
    session.add(event_a)
    event_b_date = datetime.datetime(year=2023, month=4, day=6, hour=3, minute=30)
    event_b: EventEntity = EventEntity(id=2, name="Event102", club_id=2, date=event_b_date, location="123 Short Street, Chapel Hill NC", description="A club called Club102.", attendees=[])
    session.add(event_b)
    event_c_date = datetime.datetime(year=2023, month=5, day=1, hour=4, minute=0)
    event_c: EventEntity = EventEntity(id=3, name="Event103", club_id=3, date=event_c_date, location="104 W Longview Street, Chapel Hill NC", description="A club called Club103.", attendees=[])
    session.add(event_c)
    event_d_date = datetime.datetime(year=2023, month=5, day=14, hour=2, minute=45)
    event_d: EventEntity = EventEntity(id=4, name="Event104", club_id=4, date=event_d_date, location="5012 Roxbury Lane, Kernersville NC", description="A club called Club104.", attendees=[])
    session.add(event_d)
    event_e_date = datetime.datetime(year=2023, month=5, day=29, hour=7, minute=0)
    event_e: EventEntity = EventEntity(id=5, name="Event105", club_id=5, date=event_e_date, location="1205 Pine Knolls Road, Kernersville NC", description="A club called Club105.", attendees=[])
    session.add(event_e)
    
    session.flush()
    session.commit()
    