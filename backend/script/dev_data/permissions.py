"""Sample permissions."""

from ...models import Permission
from . import roles

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

pairs = [
    (roles.student, Permission(action="*", resource="*")),
    (roles.leader, Permission(action="admin.*", resource="*")),
    (roles.leader, Permission(action="user.*", resource="*")),
    (roles.leader, Permission(action="role.*", resource="*")),
    (roles.leader, Permission(action="checkin.*", resource="*")),
    (roles.administrator, Permission(action="user.search", resource="*")),
    (roles.administrator, Permission(action="checkin.*", resource="*"))
]
