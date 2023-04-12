from fastapi import APIRouter, Depends, HTTPException
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    """Gets all registered clubs."""
    try: 
        print("🧐 backend get all called")
        return club_svc.get_all_clubs()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/user", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(subject: User = Depends(registered_user), club_svc: ClubService = Depends()):
    """Gets all the clubs a User is registered for via the User's ID."""
    try:
        print("💧 backend get user's clubs called")
        user_clubs = club_svc.get_clubs_by_user_id(subject)
        return user_clubs
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
        
@api.get("/add/{club_id}", tags=['Club'])
def add_user_to_club(
    club_id: int, 
    subject: User = Depends(registered_user), 
    club_svc: ClubService = Depends()
) -> str:
    """Signs a user up for a club via the club's ID."""
    try:
        club_svc.add_user_to_club(subject, club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.delete("/remove/{club_id}", tags=['Club'])
def remove_user_from_club(
    club_id: int, 
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
) -> str:
    """Unenrolls a user from a club via that club's ID."""
    try:
        club_svc.delete_user_from_club(subject, club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.get("/check/membership/{club_id}", response_model=bool, tags=['Club'])
def check_membership(
    club_id: int,
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
):
    """Checks if a member is in a club or not."""
    try:
        print("🍎 backend check membership called")
        return club_svc.is_user_in_club(subject, club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
