"""User model serves as the data object for representing registered users across application layers."""

from pydantic import BaseModel
from .permission import Permission

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class User(BaseModel):
    id: int | None = None
    pid: int
    onyen: str = ""
    first_name: str = ""
    last_name: str = ""
    email: str = ""
    pronouns: str = ""
    permissions: list['Permission'] = []



class NewUser(BaseModel):
    pid: int
    onyen: str
    first_name: str = ''
    last_name: str = ''
    email: str = ''
    pronouns: str = ''
    permissions: list['Permission'] = []



class ProfileForm(BaseModel):
    first_name: str
    last_name: str
    email: str
    pronouns: str


# Python... :sob:... necessary due to circularity (TODO: refactor to remove circularity)
User.update_forward_refs()
NewUser.update_forward_refs()
