from fastapi import APIRouter, Depends, HTTPException
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

# get all clubs
@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    try: 
        return club_svc.get_all_clubs()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# get all clubs a user is in using their pid
@api.get("/user/{pid}", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(pid: int, club_svc: ClubService = Depends()):
    try:
        user_clubs = club_svc.get_clubs_by_pid(pid)
        return user_clubs
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        

# Add user to club
@api.put("/add/{club_id}/{pid}", tags=['Club'])
def add_user_to_club(club_id: int, pid: int, club_svc: ClubService = Depends()):
    try:
        club_svc.add_user_to_club(pid, club_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# Remove user from club
@api.delete("/remove/{club_id}/{pid}", tags=['Club'])
def remove_user_from_club(club_id: int, pid: int, club_svc: ClubService = Depends()):
    try:
        club_svc.delete_user_from_club(pid, club_id)
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
