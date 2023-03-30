from fastapi import APIRouter, Depends
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

# get all clubs
@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    return club_svc.get_all_clubs()

# get club by user
@api.get("/user", response_model=list[Club], tags=['Club'])
def get_club_by_user(user: User = Depends(registered_user), club_svc: ClubService = Depends()):
    return club_svc.get_club_by_user(user)

# Add user to club
@api.put("/add", response_model=User, tags=['Club'])
def add_user_to_club(user: User = Depends(registered_user), club_svc: ClubService = Depends()):
    club_svc.add_user_to_club(user)
    return user

# Remove user from club
@api.delete("/remove", response_model=User, tags=['Club'])
def remove_user_from_club(user: User = Depends(registered_user), club_svc: ClubService = Depends()):
    club_svc.remove_user_from_club(user)
    return user