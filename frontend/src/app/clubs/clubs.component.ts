import { Component, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile, ProfileService } from '../profile/profile.service'
import { Club, ClubsService, User_Club } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ProfileEditorComponent } from '../profile/profile-editor/profile-editor.component';
import { WeekDayTime } from '../register-leader.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent {
  // Use an observable class so that the event data can be synchronous with the database
  
  public static Route: Route = {
    path: 'all_clubs',
    component: ClubsComponent, 
    title: 'All Clubs', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public clubs$: Observable<Club[]>
  public filtered_clubs$: Observable<Club[]>
  public user_clubs$: Observable<User_Club[]>
  public weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  public selectedWeekdays: Set<String> = new Set()
  public categories = ["Womxn", "Black/African American", "Asian American/Pacific Islander", "Hispanic/Latinx", "LGBTQIA+", "Video Games", "Hackathon", "Non-Binary", "Volunteer", "iOS Development", "Business", "Project Management"]
  public selectedWeekdayTimes: Set<[String, String]> = new Set()
  public selectedCategories: Set<String> = new Set()

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar, private profileService: ProfileService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubsService.getAllClubs()
    this.filtered_clubs$ = this.clubs$
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.user_clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club: User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
  }

  changeStatus(user_club: User_Club): void {
    if (user_club.is_joined) {
      this.onLeave(user_club.club)
    } else {
      this.onJoin(user_club.club)
    }
  }

  // Enables a student to join a club
  onJoin(club: Club): void {
    this.profileService.http.get<Profile>('/api/profile').subscribe(
      {
        next: (data) => {this.onSuccessUpdateProfile(data)},
        error: (err) => console.log(err)
      }
    )
    this.clubsService.joinClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  private onSuccessUpdateProfile(profile: Profile): void {
    this.profile = profile
  }

  // Enables a student to leave a club
  onLeave(club: Club): void {
    this.clubsService.leaveClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getAllClubs()
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.user_clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club : User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
  }

  onError(err: Error): void{
    if (err.message) {
      console.log(err)
      window.alert("The error is: " + err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }

  // Controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  // Returns a shortened description for a club
  getShortDescription(club: Club): String {
    if (club.description.length <= 67) {
      return club.description
    }
    return club.description.substring(0, 67) + "..."
  }

  selectDay(weekday: String): void {
    if (this.selectedWeekdays.has(weekday)) {
      this.selectedWeekdays.delete(weekday)
    } else {
      this.selectedWeekdays.add(weekday)
    }
  }

  hasWeekday(weekday: String): boolean {
    return this.selectedWeekdays.has(weekday)
  }

  selectWeekdayTime(weekday: String, timeslot: String): void {
    var curWeekdayTime: [String, String] = [weekday, timeslot]
    if (this.selectedWeekdayTimes.has(curWeekdayTime)) {
      this.selectedWeekdayTimes.delete(curWeekdayTime)
    } else {
      this.selectedWeekdayTimes.add(curWeekdayTime)
    }
  }

  selectCategory(category: String): void {
    if (this.selectedCategories.has(category)) {
      console.log("deleting category")
      this.selectedCategories.delete(category)
    } else {
      console.log("selecting category")
      this.selectedCategories.add(category)
    }
  }


  onFilter(): void {
    var availabilities: [String, String][] = []
    for (var availability of this.selectedWeekdayTimes) {
      availabilities.push(availability)
    }
    var categories: String[] = []
    for (var category of this.selectedCategories) {
      console.log("looping")
      categories.push(category)
    }
    this.filtered_clubs$ = this.clubsService.filterClubs(availabilities, categories)
    this.user_clubs$ = this.filtered_clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club : User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
  }
}
