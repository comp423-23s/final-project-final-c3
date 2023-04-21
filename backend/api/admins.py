from fastapi import APIRouter, Depends, HTTPException
from ..services import AdminService
from ..models import User


__authors__ = ["Aryonna Rice"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

api = APIRouter(prefix="/api/admin/actions")

@api.post("/add/admin/{pid}", tags=['Admin'])
def add_admin(
    pid: int, 
    admin_svc: AdminService = Depends()
) -> str:
    """Adding a user as an admin, by an admin."""
    try:
        print("🥎 backend add_admin called")
        admin_svc.add_admin(pid)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
@api.delete("/delete/admin/{pid}", tags=['Admin'])
def delete_admin(
    pid: int, 
    admin_svc: AdminService = Depends()
) -> str:
    """Deleting a user as an admin, by an admin."""
    try:
        print("🥎 backend add_admin called")
        admin_svc.delete_admin(pid)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.delete("/delete/club/{club_id}", tags=['Admin'])
def delete_club(
    club_id: int, 
    admin_svc: AdminService = Depends()
) -> str:
    """Deleting a user as an admin, by an admin."""
    try:
        print("🥎 backend add_admin called")
        admin_svc.delete_club(club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.delete("/delete/leader/{leader_pid}/{club_id}", tags=['Admin'])
def remove_leader_from_club(
    club_id: int,
    leader_pid: int,
    admin_svc: AdminService = Depends()
) -> str:
    """Removes a leader from a club."""
    try:
        admin_svc.delete_leader(leader_pid, club_id)
        return "OK"
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
@api.get("/get/all/admin", response_model=list[User], tags=['Admin'])
def get_all_admin(
    admin_svc: AdminService = Depends()
):
    """Returns a list of all administrators in the database."""
    try:
        print("We got to backend api method")
        return admin_svc.get_all_admin()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/get/all/users", response_model=list[User], tags=['Admin'])
def get_all_users(
    admin_svc: AdminService = Depends()
):
    """Returns a list of all users in the database."""
    try:
        return admin_svc.get_all_users()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
@api.get("/leaders/of/club", response_model=list[User], tags=['Admin'])
def get_leaders_of_a_club(
    club_id: int,
    admin_svc: AdminService = Depends()
):
    """Returns a list of all leaders of a specified club."""
    try:
        return admin_svc.get_leaders_of_a_club(club_id)
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    

@api.get("/get/all/leaders", response_model=list[User], tags=['Admin'])
def get_all_leaders(
    admin_svc: AdminService = Depends()
):
    """Returns a list of all leaders in the database."""
    try:
        return admin_svc.get_all_leaders()
    except Exception as e:
        print("❌" + str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
