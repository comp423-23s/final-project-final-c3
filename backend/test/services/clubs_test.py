"""The following tests are for the ClubService."""

import pytest

from sqlalchemy.orm import Session
from ...models import User, Role, Club
from ...entities import UserEntity, RoleEntity, ClubEntity
from ...services import ClubService

# Mock Models
student = User(id=1, pid=999999999, onyen='root', email='root@unc.edu')
student_role = Role(id=1, name='Student')

admin = User(id=2, pid=888888888, onyen='ambassador',
                  email='ambassador@unc.edu')
administrator_role = Role(id=3, name='Administrator')

leader = User(id=3, pid=111111111, onyen='user', email='user@unc.edu')
leader_role = Role(id=2, name='Leader')

club_a = Club(id=1, club_code="1AB45TY0", name="Pearl Hacks", description="Pearl Hacks is a weekend-long hackathon targeting women and non-binary students.")
club_b = Club(id=2, club_code="1NB457Y9", name="App Team", description="App Team Carolina provides a collaborative environment for UNC students to learn iOS development.")
club_c = Club(id=3, club_code="1RB65TY0", name="CSSG", description="A student-led org that works with local nonprofits to give them technology for volunteer work.")
club_d = Club(id=4, club_code="19B44T50", name="HackNC", description="The HackNC Association organizes UNC’s annual co-ed hackathon!")
club_e = Club(id=5, club_code="11B45ZX0", name="WiCS", description="A social, professional, and academic organization to empower and enable women in computer science. ")
club_models = [
    club_a, 
    club_b,
    club_c,
    club_d,
    club_e
]



@pytest.fixture(autouse=True)
def setup_teardown(test_session: Session):
    # Bootstrap student User and Role
    student_user_entity = UserEntity.from_model(student)
    test_session.add(student_user_entity)
    student_role_entity = RoleEntity.from_model(student_role)
    student_role_entity.users.append(student_user_entity)
    test_session.add(student_role_entity)

    # Bootstrap admin and role
    admin_entity = UserEntity.from_model(admin)
    test_session.add(admin_entity)
    admin_role_entity = RoleEntity.from_model(administrator_role)
    admin_role_entity.users.append(admin_entity)
    test_session.add(admin_role_entity)

    # Bootstrap leader User and Role
    leader_entity = UserEntity.from_model(leader)
    test_session.add(leader_entity)
    leader_role_entity = RoleEntity.from_model(leader_role)
    leader_role_entity.users.append(leader_entity)
    test_session.add(leader_role_entity)

    for club in club_models:
        club_entity = ClubEntity.from_model(club)
        test_session.add(club_entity)
    test_session.commit()

    yield


@pytest.fixture()
def club(test_session: Session):
    """Returning the session."""
    return ClubService(test_session)


def test_get_all_clubs(club: ClubService):
   """Checking the length of all clubs."""
   assert (len(club.get_all_clubs()) == 5)


def test_get_clubs_by_user_id(club: ClubService):
    """Checking that the the list of clubs a user is in is correct."""
    # Add a user to a club
    club_a_as_entity = ClubEntity.get(ClubEntity, 1)
    student_user_entity = UserEntity.get(UserEntity, 1)
    club_a_as_entity.members.add(student_user_entity)
    clubs = club.get_clubs_by_user_id(1)
    names: list [str] = []
    for club in clubs:
        names.append(club.name)
    assert names == ["Pearl Hacks"]


def add_leader(club: ClubService):
    """Checking that a leader is correctly added to a Club."""
    leader_as_entity = UserEntity.get(UserEntity, 3)
    leader = leader_as_entity.to_model()
    club.add_leader(leader, 3, "1NB457Y9")
    clubs = club.get_clubs_led_by_user(leader_as_entity.to_model())
    assert clubs[0].name == "Leader"


