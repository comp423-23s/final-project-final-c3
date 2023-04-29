from ...models import Event
import datetime


event_a_start = datetime.datetime(year=2023, month=4, day=3, hour=9, minute=0)
event_a_end = datetime.datetime(year=2023, month=4, day=4, hour=21, minute=59)
event_a = Event(id=1, name="Hackathon", club_id=0, club_name= "Pearl Hacks", start_time = event_a_start, end_time = event_a_end, location="123 Main Street, Chapel Hill NC", description="Hack all day! Join us on April 3rd for an overnight, fun-filled hacking experience.", attendees=[], show_short_description=True)

event_b_start = datetime.datetime(year=2023, month=4, day=6, hour=15, minute=30)
event_b_end = datetime.datetime(year=2023, month=4, day=6, hour=17, minute=30)
event_b = Event(id=2, name="Club Meeting", club_id=1, club_name="App Team", start_time = event_b_start, end_time = event_b_end, location="123 Short Street, Chapel Hill NC", description="Meet your fellow club members! Join us for snacks and meet and greet. ", show_short_description=True, attendees=[])

event_c_start = datetime.datetime(year=2023, month=5, day=1, hour=10, minute=0)
event_c_end = datetime.datetime(year=2023, month=5, day=1, hour=11, minute=30)
event_c = Event(id=3, name="Guest Speaker", club_id=2, club_name='CSSG', start_time = event_c_start, end_time = event_c_end, location="104 W Longview Street, Chapel Hill NC", description="Special guest speaker, you don't want to miss this exciting opportunity. Bring your friends!", show_short_description=True, attendees=[])

event_d_start = datetime.datetime(year=2023, month=5, day=14, hour=14, minute=45)
event_d_end = datetime.datetime(year=2023, month=5, day=14, hour=16, minute=45)
event_d = Event(id=4, name="Potluck", club_id=3, club_name='HackNC', start_time = event_d_start, end_time = event_d_end, location="5012 Roxbury Lane, Kernersville NC", description="Bring your favorite food to celebrate the end of the year with us. Desserts, appetizers, and main dishes are all welcome. ", show_short_description=True, attendees=[])

event_e_start = datetime.datetime(year=2023, month=5, day=29, hour=8, minute=0)
event_e_end = datetime.datetime(year=2023, month=5, day=29, hour=10, minute=0)
event_e = Event(id=5, name="Club Outing", club_id=4, club_name='WiCS', start_time = event_e_start, end_time = event_e_end, location="1205 Pine Knolls Road, Kernersville NC", description="Club outing to Top Golf. Show up in your best golf gear and be ready for fun!", show_short_description=True, attendees=[])


models = [
    event_a,
    event_b,
    event_c,
    event_d,
    event_e
]
