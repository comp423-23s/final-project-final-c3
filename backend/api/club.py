from fastapi import APIRouter, Depends, HTTPException
from ..services import ClubService, PotentialClubService
from ..models import User, Club, PotentialClub
from .authentication import registered_user
from typing import Tuple


api = APIRouter(prefix="/api/club")

@api.get("/all", response_model=list[Club], tags=['Club'])
def get_all_clubs(club_svc: ClubService = Depends()):
    """Gets all registered clubs."""
    try: 
        print("🥝 backend get all clubs called")
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


@api.get("/check/membership/{club_id}", response_model=bool, tags=['Club'])
def check_membership(
    club_id: int,
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
):
    """Checks if a member is in a club or not."""
    try:
        print("🍏 backend check membership called")
        print(club_svc.is_user_in_club(subject, club_id))
        return club_svc.is_user_in_club(subject, club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
    
@api.get("/add/leader/to/club/{club_id}/{given_club_code}", tags=['Club'])
def leader_register_request(
    club_id: int, 
    given_club_code: str,
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
) -> str:
    """Registers a User as a Leader for a specific club."""
    try:
        print("👨‍🚀 backend leader_register_request api called")
        club_svc.add_leader(subject, club_id, given_club_code)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/get/members/{club_id}", tags=['Club'])
def get_members(
    club_id: int, 
    club_svc: ClubService = Depends()
):
    """Returns a list of members for a particular club."""
    try:
        return club_svc.get_members(club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/get/leaders/{club_id}", tags=['Club'])
def get_leaders(
    club_id: int, 
    club_svc: ClubService = Depends()
):
    """Returns a list of leaders for a particular club."""
    try:
        return club_svc.get_leaders(club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.get("/get/club/name/{club_id}", tags=['Club'])
def get_club_name(
    club_id: int,
    club_svc: ClubService=Depends()
) -> str:
    """Returns club name for a particular club."""
    try:
        return club_svc.get_club_name(club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.delete("/delete/club/{club_id}", tags=['Club'])
def remove_leader_from_club(
    club_id: int,
    club_svc: ClubService = Depends()
) -> str:
    """Removes a club from the database."""
    try:
        club_svc.delete_club(club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.delete("/remove/leader/from/club/{club_id}", tags=['Club'])
def delete_leader(
    club_id: int,
    subject: User = Depends(registered_user),
    club_svc: ClubService = Depends()
) -> str:
    """Removes a leader from a Club's list of leaders."""
    try:
        club_svc.delete_leader(subject, club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.get("/leaders/clubs", tags=['Club'])
def get_leading_clubs(
    subject: User = Depends(registered_user), 
    club_svc: ClubService = Depends()
):
    """Gets a list of all the clubs a user leads."""
    try:
        print("🥨 backend get_leading_clubs called")
        return club_svc.get_clubs_led_by_user(subject)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

# Potential club APIs
@api.post("/potential/club/request", tags=['Club'])
def potential_club_request(
    potential_club: PotentialClub, 
    potential_club_svc: PotentialClubService = Depends()
) -> str:
    """Submitting a potential club request."""
    try:
        print("🥎 backend potential_club_request called")
        potential_club_svc.add_potential_club(potential_club)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.post("/create/club", tags=['Club'])
def create_club(
    potential_club: PotentialClub, 
    potential_club_svc: PotentialClubService = Depends()
) -> str:
    """Creates a new club and adds it to the database."""
    try:
        potential_club_svc.create_club(potential_club)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


@api.post("/reject/club", tags=['Club'])
def delete_club(
    potential_club: PotentialClub, 
    potential_club_svc: PotentialClubService = Depends()
) -> str:
    """Rejects a club's request to be a club."""
    try:
        potential_club_svc.reject_potential_club(potential_club)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/all/potential/clubs", response_model=list[PotentialClub], tags=['Club'])
def get_all_potential_clubs(potential_club_svc: PotentialClubService = Depends()):
    """Gets all potential clubs."""
    try: 
        return potential_club_svc.get_all_requests()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.post("/filter", response_model=list[Club], tags=['Club'])
def filter(
    body: list[list],
    # availabilities: list[Tuple[str, str]],
    # categories: list[str],
    club_svc: ClubService = Depends()
):
    """Gets all clubs accoriding to specificied availability and categories."""
    try:
        return club_svc.filter_by_availability_and_category(body[0], body[1])
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
    
@api.get("/club/requests", response_model=list[PotentialClub], tags=['Club'])
def user_requests(
    subject: User = Depends(registered_user),
    potential_club_svc: PotentialClubService = Depends()
):
    """Gets all potential clubs for a user."""
    try:
        return potential_club_svc.user_requests(subject)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))