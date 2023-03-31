from fastapi import APIRouter, Depends
from ..services import EventService
from ..models import User, Event
from .authentication import registered_user


api = APIRouter(prefix="/api/event")

# get events by user pid
@api.get("/by_pid/{pid}", response_model=list[Event], tags=['Event'])
def get_events_by_pid(pid: int, event_svc: EventService = Depends()):
    return event_svc.events_by_pid(pid)

# get all events
@api.get("/all", response_model=list[Event], tags=['Event'])
def get_all_events(event_svc: EventService = Depends()):
    return event_svc.get_all_events()

# get events by club
@api.get("/by_club/{club_id}", response_model=list[Event], tags=['Event'])
def get_events_by_club(club_id: int, event_svc: EventService = Depends()):
    return event_svc.display_events_by_club_id(club_id)

# delete event
@api.delete("/delete/{event}", response_model=Event, tags=['Event'])
def delete_event(event: Event, event_svc: EventService = Depends()):
    event_svc.delete_event(event)
    return event

# add user to event
@api.get("/add_to_event/{pid}", response_model=User, tags=['Event'])
def add_user_to_event(pid: int, event: Event, event_svc: EventService = Depends()):
    event_svc.add_by_pid_to_event(pid, event)
    return event

# delete user from event
@api.get("/delete_from_event/{pid}", response_model=User, tags=['Event'])
def delete_user_from_event(pid: int, event: Event, event_svc: EventService = Depends()):
    event_svc.delete_by_pid_from_event(pid, event)
    return event

