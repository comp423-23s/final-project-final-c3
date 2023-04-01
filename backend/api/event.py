from fastapi import APIRouter, Depends, HTTPException
from ..services import EventService
from ..models import User, Event
from .authentication import registered_user

api = APIRouter(prefix="/api/event")

# get events by user pid
@api.get("/by_pid/{pid}", response_model=list[Event], tags=['Event'])
def get_events_by_pid(pid: int, event_svc: EventService = Depends()):
    try:
        user_events = event_svc.events_by_pid(pid)
        return user_events
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        

# get all events
@api.get("/all", response_model=list[Event], tags=['Event'])
def get_all_events(event_svc: EventService = Depends()):
    try:
        all_events = event_svc.get_all_events()
        return all_events
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# get events by club
@api.get("/by_club/{club_id}", response_model=list[Event], tags=['Event'])
def get_events_by_club(club_id: int, event_svc: EventService = Depends()):
    try:
        club_events = event_svc.get_events_by_club_id(club_id)
        return club_events
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# delete event
@api.delete("/delete/{event}", tags=['Event'])
def delete_event(event: Event, event_svc: EventService = Depends()):
    try: 
        event_svc.delete_event(event)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        
   
# add user to event
@api.get("/add_to_event/{pid}", tags=['Event'])
def add_user_to_event(pid: int, event: Event, event_svc: EventService = Depends()):
    try:
        event_svc.add_by_pid_to_event(pid, event)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# delete user from event
@api.get("/delete_from_event/{pid}", tags=['Event'])
def delete_user_from_event(pid: int, event: Event, event_svc: EventService = Depends()):
    try:
        event_svc.delete_by_pid_from_event(pid, event)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

