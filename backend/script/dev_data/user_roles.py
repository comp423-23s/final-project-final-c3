"""Sample user/role pairings."""

from . import users
from . import roles

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

pairs = [
    (users.root, roles.student),
    (users.merritt_manager, roles.leader),
    (users.arden_ambassador, roles.administrator)
]
