"""The following tests are for the EventService."""

import pytest
import datetime
from sqlalchemy.orm import Session
from ...models import User, Role, Event
from ...entities import UserEntity, RoleEntity, EventEntity
from ...services import EventService

# Mock Events
event_a_start = datetime.datetime(year=2023, month=4, day=3, hour=5, minute=0)
event_a_end = datetime.datetime(year=2023, month=4, day=4, hour=8, minute=0)
event_a = Event(id=1, name="Hackathon", club_id=0, club_name= "Pearl Hacks", start_time = event_a_start, end_time = event_a_end, location="123 Main Street, Chapel Hill NC", description="Hack all day! Join us on April 3rd for an overnight, fun-filled hacking experience.", attendees=[], show_short_description=True)

event_b_start = datetime.datetime(year=2023, month=4, day=6, hour=3, minute=30)
event_b_end = datetime.datetime(year=2023, month=4, day=6, hour=5, minute=30)
event_b = Event(id=2, name="Club Meeting", club_id=1, club_name="App Team", start_time = event_b_start, end_time = event_b_end, location="123 Short Street, Chapel Hill NC", description="Meet your fellow club members! Join us for snacks and meet and greet. ", show_short_description=True, attendees=[])

event_c_start = datetime.datetime(year=2023, month=5, day=1, hour=4, minute=0)
event_c_end = datetime.datetime(year=2023, month=5, day=1, hour=6, minute=0)
event_c = Event(id=3, name="Guest Speaker", club_id=2, club_name='CSSG', start_time = event_c_start, end_time = event_c_end, location="104 W Longview Street, Chapel Hill NC", description="Special guest speaker, you don't want to miss this exciting opportunity. Bring your friends!", show_short_description=True, attendees=[])

event_d_start = datetime.datetime(year=2023, month=5, day=14, hour=2, minute=45)
event_d_end = datetime.datetime(year=2023, month=5, day=14, hour=4, minute=45)
event_d = Event(id=4, name="Potluck", club_id=3, club_name='HackNC', start_time = event_d_start, end_time = event_d_end, location="5012 Roxbury Lane, Kernersville NC", description="Bring your favorite food to celebrate the end of the year with us. Desserts, appetizers, and main dishes are all welcome. ", show_short_description=True, attendees=[])

event_e_start = datetime.datetime(year=2023, month=5, day=29, hour=7, minute=0)
event_e_end = datetime.datetime(year=2023, month=5, day=29, hour=9, minute=0)
event_e = Event(id=5, name="Club outing", club_id=4, club_name='WiCS', start_time = event_e_start, end_time = event_e_end, location="1205 Pine Knolls Road, Kernersville NC", description="Club outing to Top Golf. Show up in your best golf gear and be ready for fun!", show_short_description=True, attendees=[])

event_models = [
    event_a,
    event_b,
    event_c,
    event_d,
    event_e
]

# Mock Users
student = User(id=1, pid=999999999, onyen='root', email='root@unc.edu')
student_role = Role(id=1, name='Student')

admin = User(id=2, pid=888888888, onyen='ambassador', email='ambassador@unc.edu')
administrator_role = Role(id=3, name='Administrator')

leader = User(id=3, pid=111111111, onyen='user', email='user@unc.edu')
leader_role = Role(id=2, name='Leader')

@pytest.fixture(autouse=True)
def setup_teardown(test_session: Session):
# Bootstrap student User and Role
    student_user_entity = UserEntity.from_model(student)
    test_session.add(student_user_entity)
    student_role_entity = RoleEntity.from_model(student_role)
    student_role_entity.users.append(student_user_entity)
    test_session.add(student_role_entity)

    # Bootstrap admin and role
    admin_entity = UserEntity.from_model(admin)
    test_session.add(admin_entity)
    admin_role_entity = RoleEntity.from_model(administrator_role)
    admin_role_entity.users.append(admin_entity)
    test_session.add(admin_role_entity)

    # Bootstrap leader User and Role
    leader_entity = UserEntity.from_model(leader)
    test_session.add(leader_entity)
    leader_role_entity = RoleEntity.from_model(leader_role)
    leader_role_entity.users.append(leader_entity)
    test_session.add(leader_role_entity)

    for event in event_models:
        event_entity = EventEntity.from_model(event)
        test_session.add(event_entity)
        test_session.commit()
    yield

@pytest.fixture()
def event(test_session: Session):
    """Returning the session."""
    return EventService(test_session)


def test_get_all_events(event: EventService):
    """Checking the length of all events."""
    assert (len(event.get_all_clubs()) == 5)


def add_attendee(event: EventService):
    """Checking that a user is succesfully added to an Event."""
    event_a_as_entity = EventEntity.get(EventEntity, 1)
    event.add_user_to_event(student, event_a_as_entity.id)
    events = event.events_by_user(student)
    assert events[0].name == str(event_a_as_entity.name)