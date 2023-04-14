"""Sample User models to use in the development environment.

These were intially designed to be used by the `script.reset_database` module."""

from ...models import Role

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

student = Role(id=1, name="Student")

leader = Role(id=2, name="Leader")

administrator = Role(id=3, name="Administrator")

models = [
    student,
    leader,
    administrator
]
