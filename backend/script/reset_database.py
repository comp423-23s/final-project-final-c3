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

# python3 -m backend.script.reset_database

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


if getenv("MODE") != "development":
    print("This script can only be run in development mode.", file=sys.stderr)
    print("Add MODE=development to your .env file in workspace's `backend/` directory")
    exit(1)

# python3 -m backend.script.reset_database

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

# Add Clubs
with Session(engine) as session:
    from .dev_data import clubs
    to_entity = entities.ClubEntity.from_model
    session.add_all([to_entity(model) for model in clubs.models])
    session.execute(text(f'ALTER SEQUENCE {entities.ClubEntity.__table__}_id_seq RESTART WITH {len(clubs.models) + 1}'))
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
    # club_a: ClubEntity = ClubEntity(id=1, club_code="1AB45TY0", name="Pearl Hacks", description="Pearl Hacks is a weekend-long hackathon targeting women and non-binary students.")
    # session.add(club_a)
    # club_b: ClubEntity = ClubEntity(id=2, club_code="1NB457Y9", name="App Team", description="App Team Carolina provides a collaborative environment for UNC students to learn iOS development.")
    # session.add(club_b)
    # club_c: ClubEntity = ClubEntity(id=3, club_code="1RB65TY0", name="CSSG", description="A student-led org that works with local nonprofits to give them technology for volunteer work.")
    # session.add(club_c)
    # club_d: ClubEntity = ClubEntity(id=4, club_code="19B44T50", name="HackNC", description="The HackNC Association organizes UNC’s annual co-ed hackathon!")
    # session.add(club_d)
    # club_e: ClubEntity = ClubEntity(id=5, club_code="11B45ZX0", name="WiCS", description="A social, professional, and academic organization to empower and enable women in computer science. ")
    # session.add(club_e)

    #Fake Events
    event_a_start = datetime.datetime(year=2023, month=4, day=3, hour=5, minute=0)
    event_a_end = datetime.datetime(year=2023, month=4, day=4, hour=8, minute=0)
    event_a: EventEntity = EventEntity(id=1, name="Hackathon", club_id=1, start_time = event_a_start, end_time = event_a_end, location="123 Main Street, Chapel Hill NC", description="Hack all day!", attendees=[])
    session.add(event_a)
    event_b_start = datetime.datetime(year=2023, month=4, day=6, hour=3, minute=30)
    event_b_end = datetime.datetime(year=2023, month=4, day=6, hour=5, minute=30)
    event_b: EventEntity = EventEntity(id=2, name="Club Meeting", club_id=2, start_time = event_b_start, end_time = event_b_end, location="123 Short Street, Chapel Hill NC", description="Meet all the people in the club", attendees=[])
    session.add(event_b)
    event_c_start = datetime.datetime(year=2023, month=5, day=1, hour=4, minute=0)
    event_c_end = datetime.datetime(year=2023, month=5, day=1, hour=6, minute=0)
    event_c: EventEntity = EventEntity(id=3, name="Guest Speaker", club_id=3, start_time = event_c_start, end_time = event_c_end, location="104 W Longview Street, Chapel Hill NC", description="Special guest speaker", attendees=[])
    session.add(event_c)
    event_d_start = datetime.datetime(year=2023, month=5, day=14, hour=2, minute=45)
    event_d_end = datetime.datetime(year=2023, month=5, day=14, hour=4, minute=45)
    event_d: EventEntity = EventEntity(id=4, name="Potluck", club_id=4, start_time = event_d_start, end_time = event_d_end, location="5012 Roxbury Lane, Kernersville NC", description="Bring your favorite food", attendees=[])
    session.add(event_d)
    event_e_start = datetime.datetime(year=2023, month=5, day=29, hour=7, minute=0)
    event_e_end = datetime.datetime(year=2023, month=5, day=29, hour=9, minute=0)
    event_e: EventEntity = EventEntity(id=5, name="Club outing", club_id=5, start_time = event_e_start, end_time = event_e_end, location="1205 Pine Knolls Road, Kernersville NC", description="Club outing to Top Golf", attendees=[])
    session.add(event_e)
    
    session.flush()
    session.commit()
    