from fastapi import APIRouter, Depends, HTTPException
from ...services import ClubService, PermissionService, PotentialClubService
from ...models import User, Club, PotentialClub
from ..authentication import registered_user

api = APIRouter(prefix="/api/admin/club/requests")

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


@api.post("/potential/club/request", tags=['Club'])
def potential_club_request(
    potential_club: PotentialClub, 
    potential_club_svc: PotentialClubService = Depends()
) -> str:
    """Submitting a potential club request."""
    try:
        potential_club_svc.add_potential_club(potential_club)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
    
@api.get("/all/potential/clubs", response_model=list[PotentialClub], tags=['Club'])
def get_all_clubs(potential_club_svc: PotentialClubService = Depends()):
    """Gets all registered clubs."""
    try: 
        return potential_club_svc.get_all_requests()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))


