from fastapi import APIRouter, Depends
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

# get all clubs
@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    all_clubs = club_svc.get_all_clubs()
    if all_clubs is None:
        return []
    return all_clubs

# get all clubs a user is in using their pid
@api.get("/user/{pid}", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(pid: int, club_svc: ClubService = Depends()):
    user_clubs = club_svc.get_clubs_by_pid(pid)
    if user_clubs is None:
        return []
    return user_clubs

# Add user to club
@api.put("/add/{club_id}/{pid}", response_model=User, tags=['Club'])
def add_user_to_club(club_id: int, pid: int, club_svc: ClubService = Depends()):
    club_svc.add_user_to_club(pid, club_id)
    return "User added to club."

# Remove user from club
@api.delete("/remove/{club_id}", response_model=User, tags=['Club'])
def remove_user_from_club(club_id: int, pid: int,club_svc: ClubService = Depends()):
    club_svc.delete_user_from_club(pid, club_id)
    return "User removed from club."