from fastapi import APIRouter, Depends, HTTPException
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

# DONE: Get all clubs
@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    try: 
        return club_svc.get_all_clubs()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    

# TODO: Get all clubs a user is in using their pid
@api.get("/user", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(subject: User = Depends(registered_user), club_svc: ClubService = Depends()):
    try:
        user_clubs = club_svc.get_clubs_by_pid(subject.pid)
        return user_clubs
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
        
# TODO: Add user to club
@api.get("/add/{club_id}", tags=['Club'])
def add_user_to_club(
    club_id: int, 
    subject: User = Depends(registered_user), 
    club_svc: ClubService = Depends()
) -> str:
    try:
        club_svc.add_user_to_club(subject, club_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# TODO: Remove user from club
@api.delete("/remove/{club_id}", tags=['Club'])
def remove_user_from_club(
    club_id: int, 
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
) -> str:
    try:
        club_svc.delete_user_from_club(subject, club_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
