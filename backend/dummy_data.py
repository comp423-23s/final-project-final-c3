"""Creates and adds fake data to data base."""

from backend.entities.club_entity import ClubEntity
from .services import ClubService, EventService
from .models import Club, Event
from .database import db_session
from sqlalchemy.orm import Session
import datetime
from fastapi import Depends

# Fake Clubs.
session: Session = Depends(db_session)
csv: ClubService = ClubService
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
event_a_date = datetime(year=2023, month=4, day=3, hour=5, minute=0)
event_a: Event = Event(id=1, name="Event101", club_id=1, date=event_a_date, location="123 Main Street, Chapel Hill NC", description="A club called Club101.", attendees=[])
session.add(event_a)
event_b_date = datetime(year=2023, month=4, day=6, hour=3, minute=30)
event_b: Event = Event(id=2, name="Event102", club_id=2, date=event_b_date, location="123 Short Street, Chapel Hill NC", description="A club called Club102.", attendees=[])
session.add(event_b)
event_c_date = datetime(year=2023, month=5, day=1, hour=4, minute=0)
event_c: Event = Event(id=3, name="Event103", club_id=3, date=event_c_date, location="104 W Longview Street, Chapel Hill NC", description="A club called Club103.", attendees=[])
session.add(event_c)
event_d_date = datetime(year=2023, month=5, day=14, hour=2, minute=45)
event_d: Event = Event(id=4, name="Event104", club_id=4, date=event_d_date, location="5012 Roxbury Lane, Kernersville NC", description="A club called Club104.", attendees=[])
session.add(event_d)
event_e_date = datetime(year=2023, month=5, day=29, hour=7, minute=0)
event_e: Event = Event(id=5, name="Event105", club_id=5, date=event_e_date, location="1205 Pine Knolls Road, Kernersville NC", description="A club called Club105.", attendees=[])
session.add(event_e)

session.flush()
session.commit()





