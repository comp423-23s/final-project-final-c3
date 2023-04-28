from ...models import WeekDayTime


__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

club_a_time = WeekDayTime(id=0, day="Tuesday", start_time="08:00", end_time="09:00")
club_b_time_1 = WeekDayTime(id=1, day="Monday", start_time="18:00", end_time="19:00")
club_b_time_2 = WeekDayTime(id=2, day="Thursday", start_time="14:00", end_time="15:00")
club_c_time = WeekDayTime(id=3, day="Thursday", start_time="15:00", end_time="16:30")
club_d_time = WeekDayTime(id=4, day="Wednesday", start_time="20:00", end_time="21:30")
club_e_time = WeekDayTime(id=5, day="Friday", start_time="09:30", end_time="10:30")

models = [
    club_a_time,
    club_b_time_1,
    club_b_time_2,
    club_c_time,
    club_d_time,
    club_e_time
]