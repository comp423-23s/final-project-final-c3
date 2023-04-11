from fastapi import APIRouter, Depends, HTTPException
from ..services import EventService
from ..models import User, Event
from .authentication import registered_user
from ..entities import EventEntity, UserEntity

api = APIRouter(prefix="/api/event")


# Get all events
@api.get("/all", response_model=list[Event], tags=['Event'])
def get_all_events(event_svc: EventService = Depends()):
    try:
        print('Entered try block')
        return event_svc.get_all_events()
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=400, detail=str(e))


# Get events by club
@api.get("/by_club/{club_id}", response_model=list[Event], tags=['Event'])
def get_events_by_club(club_id: int, event_svc: EventService = Depends()):
    try:
        club_events = event_svc.get_events_by_club_id(club_id)
        return club_events
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))


# Delete an event
@api.delete("/delete/{event_id}", tags=['Event'])
def delete_event(event_id: int, event_svc: EventService = Depends()) -> str:
    try: 
        event_svc.delete_event(event_id)
        return "OK"
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))
        

# Get all events a user is registered for
@api.get("/user_events", response_model=list[Event], tags=['Event'])
def get_events_by_user(subject: User = Depends(registered_user), event_svc: EventService = Depends()):
    try:
        user_events = event_svc.events_by_user(subject)
        return user_events
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))
   

#Add user to event
@api.get("/add_to_event/{event_id}", tags=['Event'])
def add_user_to_event(
    event_id: int, 
    subject: User = Depends(registered_user), 
    event_svc: EventService = Depends()) -> str:
    try: 
        event_svc.add_user_to_event(subject, event_id)
        return "OK"
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))


# Delete user from event
@api.delete("/delete_from_event/{event_id}", tags=['Event'])
def delete_user_from_event(
    event_id: int, 
    subject: User = Depends(registered_user), 
    event_svc: EventService = Depends()) -> str:
    try: 
        event_svc.delete_user_from_event(subject, event_id)
        return "OK"
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
    
# Get all users in an event
@api.get("/get_users/{event_id}", tags=['Event'])
def get_users_in_event(
    event_id: int, 
    event_svc: EventService = Depends()) -> str:
    try: 
        users = event_svc.get_users_in_event(event_id)
        return users
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))

# Determine if user is registered for event
@api.get("/is_user_registered/{event_id}", tags=['Event'])
def is_user_registered(
    event_id: int, 
    subject: User = Depends(registered_user), 
    event_svc: EventService = Depends()) -> bool:
    try: 
        is_registered = event_svc.is_user_registered(subject, event_id)
        return is_registered
    except Exception as e:
        print("❌ " + str(e))
        raise HTTPException(status_code=404, detail=str(e))