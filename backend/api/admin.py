from fastapi import APIRouter, Depends, HTTPException
from ..services import RoleService, AdminService, UserPermissionError
from ..models import User, Role, RoleDetails, Permission
from .authentication import registered_user


__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

api = APIRouter(prefix="/api/admin/actions")

@api.post("/add/admin/", tags=['Admin'])
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