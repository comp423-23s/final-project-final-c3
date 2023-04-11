from fastapi import APIRouter, Depends, HTTPException
from ..services import ClubService
from ..models import User, Club
from .authentication import registered_user

api = APIRouter(prefix="/api/club")

@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    """Gets all registered clubs."""
    try: 
        return club_svc.get_all_clubs()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/user", response_model=list[Club], tags=['Club'])
def get_clubs_by_pid(subject: User = Depends(registered_user), club_svc: ClubService = Depends()):
    """Gets all the clubs a User is registered for via the User's ID."""
    try:
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


@api.delete("/remove/from/{club_id}", tags=['Club'])
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

# Club Leader Methods Below
@api.delete("/delete/{club_id}", tags=['Club'])
def delete_club(
    club_id: int, 
    club_svc: ClubService = Depends()
) -> str:
    """Deletes a Club from our database."""
    try:
        club_svc.delete_club(club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))

@api.get("/members", tags=['Club'])
def add_user_to_club(
    club_id: int, 
    club_svc: ClubService = Depends()
) -> list[Club]:
    """Retrives a list of all the members of a Club."""
    try:
        clubs = club_svc.get_members(club_id)
        return clubs
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))

@api.post("/create/club", tags=['Club'])
def create_club(
    club: Club, 
    club_svc: ClubService = Depends()
) -> str:
    """Creates a new club and adds it to the database."""
    try:
        club_svc.create_club(club)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))