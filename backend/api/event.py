from fastapi import APIRouter, Depends
from ..services import EventService
from ..models import User, Event
from .authentication import registered_user

api = APIRouter(prefix="/api/event")

# get events by user pid
@api.get("/by_pid", response_model=list[Event], tags=['Event'])
def get_events_by_pid(pid: int, event_svc: EventService = Depends()):
    return event_svc.events_by_pid(pid)

# get all events
@api.get("/all", response_model=list[Event], tags=['Event'])
def get_all_events(event_svc: EventService = Depends()):
    return event_svc.get_all_events()

# get events by club
@api.get("/by_club", response_model=list[Event], tags=['Event'])
def get_events_by_club(club_id: int, event_svc: EventService = Depends()):
    return event_svc.display_events_by_club_id(club_id)

# delete event
@api.delete("/delete", response_model=Event, tags=['Event'])
def delete_event(event: Event, event_id: int, event_svc: EventService = Depends()):
    event_svc.delete_event(event, event_id)
    return event