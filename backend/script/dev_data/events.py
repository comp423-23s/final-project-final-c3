from ...models import Event
import datetime


event_a_start = datetime.datetime(year=2023, month=4, day=3, hour=5, minute=0)
event_a_end = datetime.datetime(year=2023, month=4, day=4, hour=8, minute=0)
event_a = Event(id=1, name="Hackathon", club_id=0, start_time = event_a_start, end_time = event_a_end, location="123 Main Street, Chapel Hill NC", description="Hack all day!", attendees=[], show_short_description=True)

event_b_start = datetime.datetime(year=2023, month=4, day=6, hour=3, minute=30)
event_b_end = datetime.datetime(year=2023, month=4, day=6, hour=5, minute=30)
event_b = Event(id=2, name="Club Meeting", club_id=1, start_time = event_b_start, end_time = event_b_end, location="123 Short Street, Chapel Hill NC", description="Meet all the people in the club", show_short_description=True, attendees=[])

event_c_start = datetime.datetime(year=2023, month=5, day=1, hour=4, minute=0)
event_c_end = datetime.datetime(year=2023, month=5, day=1, hour=6, minute=0)
event_c = Event(id=3, name="Guest Speaker", club_id=2, start_time = event_c_start, end_time = event_c_end, location="104 W Longview Street, Chapel Hill NC", description="Special guest speaker", show_short_description=True, attendees=[])

event_d_start = datetime.datetime(year=2023, month=5, day=14, hour=2, minute=45)
event_d_end = datetime.datetime(year=2023, month=5, day=14, hour=4, minute=45)
event_d = Event(id=4, name="Potluck", club_id=3, start_time = event_d_start, end_time = event_d_end, location="5012 Roxbury Lane, Kernersville NC", description="Bring your favorite food", show_short_description=True, attendees=[])

event_e_start = datetime.datetime(year=2023, month=5, day=29, hour=7, minute=0)
event_e_end = datetime.datetime(year=2023, month=5, day=29, hour=9, minute=0)
event_e = Event(id=5, name="Club outing", club_id=4, start_time = event_e_start, end_time = event_e_end, location="1205 Pine Knolls Road, Kernersville NC", description="Club outing to Top Golf", show_short_description=True, attendees=[])


models = [
    event_a,
    event_b,
    event_c,
    event_d,
    event_e
]