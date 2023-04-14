from ...models import Club

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


club_a = Club(id=1, club_code="1AB45TY0", name="Pearl Hacks", description="Pearl Hacks is a weekend-long hackathon targeting women and non-binary students.")
club_b = Club(id=2, club_code="1NB457Y9", name="App Team", description="App Team Carolina provides a collaborative environment for UNC students to learn iOS development.")
club_c = Club(id=3, club_code="1RB65TY0", name="CSSG", description="A student-led org that works with local nonprofits to give them technology for volunteer work.")
club_d = Club(id=4, club_code="19B44T50", name="HackNC", description="The HackNC Association organizes UNC’s annual co-ed hackathon!")
club_e = Club(id=5, club_code="11B45ZX0", name="WiCS", description="A social, professional, and academic organization to empower and enable women in computer science. ")

models = [
    club_a,
    club_b,
    club_c,
    club_d,
    club_e
]