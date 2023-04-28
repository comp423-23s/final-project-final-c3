import { Component, Injectable, ViewChild, ElementRef } from '@angular/core';
import { Observable, map} from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile, ProfileService } from '../profile/profile.service'
import { Club, ClubsService, User_Club } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent {

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
  public selectedWeekdayTimes: Set<String> = new Set()
  public categories = ["Womxn", "Black/African American", "Asian American/Pacific Islander", "Hispanic/Latinx", "LGBTQIA+", "Video Games", "Hackathon", "Non-binary", "Volunteer", "iOS Development", "Business", "Project Management"]
  public selectedCategories: Set<String> = new Set()
  public searchText = ''
  public toggleSearch: boolean = false;

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar, private profileService: ProfileService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubsService.getAllClubs()
    this.filtered_clubs$ = this.clubs$
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(club => {
        return {...club, show_short_description: true}})
    }))
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
      next: () => this.onSuccessJoin(),
      error: (err) => this.onError(err)
    })
  }

  private onSuccessUpdateProfile(profile: Profile): void {
    this.profile = profile
  }

  // Enables a student to leave a club
  onLeave(club: Club): void {
    this.clubsService.leaveClub(club).subscribe({
      next: () => this.onSuccessLeave(),
      error: (err) => this.onError(err)
    })
  }

  onSuccessJoin(): void {
    this.snackBar.open("Successfully Joined Club " , "", { duration: 4000 })
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

  onSuccessLeave(): void {
    this.snackBar.open("Successfully Left Club " , "", { duration: 4000 })
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
      this.snackBar.open("⚠️ Join Unsuccessful: This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    } else {
      this.snackBar.open("⚠️ Join Unsuccessful: This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    }
    this.snackBar.open("⚠️ Join Unsuccessful: You May Need To Update Your Profile " , "", { duration: 4000 })
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
      var newSelectedWeekdayTimes: Set<String> = new Set()
      for (var weekdayTime of this.selectedWeekdayTimes) {
        if (weekdayTime.split(" ")[0] != weekday) {
          newSelectedWeekdayTimes.add(weekdayTime)
        }
      }
      this.selectedWeekdayTimes = newSelectedWeekdayTimes
    } else {
      this.selectedWeekdays.add(weekday)
    }
  }

  isWeekdaySelected(weekday: String): boolean {
    return this.selectedWeekdays.has(weekday)
  }

  selectWeekdayTime(weekday: String, timeslot: String): void {
    var curWeekdayTime: String = weekday + " " + timeslot
    if (this.selectedWeekdayTimes.has(curWeekdayTime)) {
      this.selectedWeekdayTimes.delete(curWeekdayTime)
    } else {
      this.selectedWeekdayTimes.add(curWeekdayTime)
    }
  }

  isCategorySelected(category: String): boolean {
    return this.selectedCategories.has(category)
  }

  selectCategory(category: String): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category)
    } else {
      this.selectedCategories.add(category)
    }
  }

  onFilter(): void {
    for (var weekday of this.selectedWeekdays) {
      var thisWeekdayHasTimeSlot = false
      for (var weekdayTime of this.selectedWeekdayTimes) {
        if (weekdayTime.split(" ")[0] == weekday) {
          thisWeekdayHasTimeSlot = true
          break
        }
      }
      if (!thisWeekdayHasTimeSlot) {
        window.alert("Please select your time slot(s) for " + weekday)
        return
      }
    }
    var availabilities: [String, String][] = []
    for (var availability of this.selectedWeekdayTimes) {
      availabilities.push([availability.split(" ")[0], availability.split(" ")[1]])
    }
    var categories: String[] = []
    for (var category of this.selectedCategories) {
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

  onShowAllClubs(): void {
    this.user_clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club : User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
    this.filtered_clubs$ = this.clubs$
    this.selectedWeekdays = new Set()
    this.selectedWeekdayTimes = new Set()
    this.selectedCategories = new Set()
  }

  convertToTime(timeStr: String) {
    var amOrPm: String = "AM"
    var hour: number = parseInt(timeStr.split(":")[0])
    var min: number = parseInt(timeStr.split(":")[1])
    if (hour >= 12) {
      amOrPm = 'PM'
    }
    if (hour > 12) {
      hour = hour - 12
    }
    return `${hour<10?'0':''}${hour}:${min<10?'0':''}${min} ${amOrPm}`
  }

  openSearch() {
    this.toggleSearch = true
  }

  textChanged() {
    this.user_clubs$ = this.user_clubs$.pipe(map((user_clubs: User_Club[]) => {
        return user_clubs.filter(a_user_club => a_user_club.club.name.toLowerCase().includes(this.searchText.toLowerCase()))
    }))
  }

  searchClose() {
    this.searchText = ''
    this.toggleSearch = false
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
}
