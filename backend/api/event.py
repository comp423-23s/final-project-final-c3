from fastapi import APIRouter, Depends, HTTPException
from ..services import EventService
from ..models import User, Event
from .authentication import registered_user

api = APIRouter(prefix="/api/event")


# DONE: Get all events
@api.get("/all", response_model=list[Event], tags=['Event'])
def get_all_events(event_svc: EventService = Depends()):
    try:
        print('Entered try block')
        return event_svc.get_all_events()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# TODO: Get events by club
@api.get("/by_club/{club_id}", response_model=list[Event], tags=['Event'])
def get_events_by_club(club_id: int, event_svc: EventService = Depends()):
    try:
        club_events = event_svc.get_events_by_club_id(club_id)
        return club_events
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# TODO: Delete an event
@api.delete("/delete/{event_id}", tags=['Event'])
def delete_event(event_id: int, event_svc: EventService = Depends()):
    try: 
        event_svc.delete_event(event_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        

# TODO: Get all events a user in by their PID
@api.get("/by_pid/{pid}", response_model=list[Event], tags=['Event'])
def get_events_by_pid(pid: int, event_svc: EventService = Depends()):
    try:
        user_events = event_svc.events_by_pid(pid)
        return user_events
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
   

# TODO: Add user to event
@api.get("/add_to_event/{event_id}", tags=['Event'])
def add_user_to_event(
    event_id: int, 
    subject: User = Depends(registered_user), 
    event_svc: EventService = Depends()) -> str:
    try: 
        event_svc.add_user_to_event(subject, event_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))



# TODO: Delete user from event
@api.get("/delete_from_event/{event_id}", tags=['Event'])
def delete_user_from_event(
    event_id: int, 
    subject: User = Depends(registered_user), 
    event_svc: EventService = Depends()) -> str:
    try: 
        event_svc.delete_user_from_event(subject, event_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
