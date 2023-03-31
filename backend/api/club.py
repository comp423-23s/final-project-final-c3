from fastapi import APIRouter, Depends
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

# get all clubs
@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    return club_svc.get_all_clubs()

# get clubs by pid
@api.get("/user/{pid}", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(pid: int, club_svc: ClubService = Depends()):
    return club_svc.get_clubs_by_pid(pid)

# Add user to club
@api.put("/add/{pid}", response_model=User, tags=['Club'])
def add_user_to_club(pid: int = Depends(registered_user), club_svc: ClubService = Depends()):
    club_svc.add_user_to_club(pid)
    return 

# Remove user from club
@api.delete("/remove/{pid}", response_model=User, tags=['Club'])
def remove_user_from_club(pid: int, club: Club, club_svc: ClubService = Depends()):
    club_svc.delete_user_from_club(pid, club)
    return club