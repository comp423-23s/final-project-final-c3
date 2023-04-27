"""club/categories pairings."""

from . import clubs
from . import week_day_times

__authors__ = ["Kris Jordan"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

pairs = [
    (clubs.club_a, week_day_times.club_a_time),
    (clubs.club_b, week_day_times.club_b_time_1),
    (clubs.club_b, week_day_times.club_b_time_2),
    (clubs.club_c, week_day_times.club_c_time),
    (clubs.club_d, week_day_times.club_d_time),
    (clubs.club_e, week_day_times.club_e_time),
]