import pytest

from sqlalchemy.orm import Session
from ...models import User, Club, Event
from ...entities import ClubEntity, EventEntity
from ...services import ClubService, EventService
from datetime import datetime 

# Mock Models
club = Club(id=1, name='Test Club', description='Test Club Description')
event = Event(id=1, name='Test Event', club_id= 1, date = datetime.now(), location="FB009", description='Test Event Description', attendees=[])

@pytest.fixture(autouse=True)
def setup_teardown(test_session: Session):
    # Bootstrap user without any special perms

    club_entity = ClubEntity.from_model(club)
    test_session.add(club_entity)

    event_entity = EventEntity.from_model(event)
    test_session.add(event_entity)

    test_session.commit()

    yield
    
@pytest.fixture()
def club_service(test_session: Session):
    return ClubService(test_session)

def test_get_all_clubs(club_service: ClubService):
    assert club_service.get_all_clubs() is not None

@pytest.fixture()    
def event_service(test_session: Session):
    return EventService(test_session)

def test_get_all_events(event_service: EventService):
    assert event_service.get_all_events() is not None
    

    


        
        