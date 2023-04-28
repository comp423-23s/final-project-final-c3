import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Club, ClubsService } from '../clubs.service';
import { PotentialClub, WeekDayTime, Category, RegisterLeaderService } from '../register-leader.service';
import { FormBuilder } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { ProfileService } from '../profile/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-register-leader',
  templateUrl: './register-leader.component.html',
  styleUrls: ['./register-leader.component.css']
})
export class RegisterLeaderComponent {

  public static Route: Route = {
    path: 'register_leader',
    component: RegisterLeaderComponent,
    title: 'Register As a Club Leader',
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public clubs$: Observable<Club[]>
  public selectedClub: Club = {id: 0, club_code: "ABCD1234", name: "Dummy Club", description: "dummy description", show_short_description: true, members: [], meeting_times: [], categories: []}
  public selectedClubId: number = 0
  public clubExists = true
  public potentialClubId = 0
  public categoryNames = ["Womxn", "Black/AA", "Asian American/Pacific Islander", "Hispanic/Latinx", "LGBTQIA+", "Video Games", "Hackathon", "Non-binary", "Volunteer", "iOS Development", "Business", "Project Management"]
  public selectedWeekdays: Set<String> = new Set()
  public selectedCategories: Set<String> = new Set()
  public mondayStartTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public mondayEndTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public tuesdayStartTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public tuesdayEndTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public wednesdayStartTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public wednesdayEndTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public thursdayStartTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public thursdayEndTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public fridayStartTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public fridayEndTime = `${new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`;
  public categoryMap = new Map<String, number>()

  constructor(
    route: ActivatedRoute, 
    private formBuilder: FormBuilder, 
    private registerLeaderService: RegisterLeaderService, 
    private clubService: ClubsService, 
    protected snackBar: MatSnackBar, 
    private dialog: Dialog,
    private navigationComponent: NavigationComponent, 
    private roleAdminService: RoleAdminService, 
    private profileService: ProfileService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
    for (let i = 1; i <= this.categoryNames.length; i++) {
      this.categoryMap.set(this.categoryNames[i - 1], i)
    }
  }

  // A function that changes whether or not a clubs exists
  changeClubExistStatus() {
    this.clubExists = !this.clubExists
  }

  // A function that chooses the correct club
  selectionChange(clubName: string) {
    this.clubs$.subscribe({
      next: (clubs) => this.selectionChangeOnSuccess(clubs, clubName),
      error: (err) => console.log(err)
    })
  }

  selectionChangeOnSuccess(clubs: Club[], clubName: string) {
    for (var club of clubs) {
      if (club.name === clubName) {
        this.selectedClubId = club.id
        break
      }
    }
    console.log("Selected club id is " + this.selectedClubId)
  }

  onSubmitExistingClub(clubCode: String): void {
    this.registerLeaderService.leaderRegistrationRequestForExistingClub(this.selectedClubId, clubCode).subscribe({
      next: () => this.existingClubOnSuccess(),
      error: (err) => this.existingClubOnError(err)
    })
  }

  // Function that displays message is leader regstration was successful
  existingClubOnSuccess(): void {
    this.snackBar.open("Leader registration was successful", "", { duration: 4000 })
  }

  //Function that displays error message if the club code was incorrect
  existingClubOnError(err: Error): void{
    if (err.message === "400") {
      console.log(err)
      this.snackBar.open("⚠️ Wrong Club Code: Leader Registration Request Denied", "", { duration: 4000 })
    } else if (err.message === "409") {
      console.log(err)
      this.snackBar.open("⚠️ You are already a leader of this club", "", { duration: 4000 })
    }
    else if (err.message === "404") {
      console.log(err)
      this.snackBar.open("⚠️ Club does not exist", "", { duration: 4000 })
    }
    else if (err.message === "500") {
      console.log(err)
      this.snackBar.open("⚠️ Internal Server Error. Try again later!", "", { duration: 4000 })
    }
    else {
      this.snackBar.open("⚠️ Wrong Club Code: Leader Registration Request Denied", "", { duration: 4000 })
    }
  }

  onSubmitNewClub(clubName: string, clubDescription: string): void {
    if (clubName.length != 0 && clubDescription.length != 0) {
      this.profileService.http.get<Profile>('/api/profile').subscribe(
        {
          next: (data) => {this.onSuccessUpdateProfile(data, clubName, clubDescription)},
          error: (err) => this.newClubOnError(err)
        }
      )
    } else {
      this.snackBar.open("Please Enter Club Name and Description", "", { duration: 4000 })
    }
  }

  private onSuccessUpdateProfile(profile: Profile, clubName: String, clubDescription: string): void {
    var meetingTimes: WeekDayTime[] = []
    if (this.hasWeekday("Monday")) {
      if (this.mondayEndTime < this.mondayStartTime) {
        this.snackBar.open("Your Club's Monday Meeting End Time Can't Be Before Start Time", "", { duration: 4000 })
        return
      }
      var mondayWeekdayTime: WeekDayTime = {
        id: undefined,
        day: "Monday",
        start_time: this.mondayStartTime,
        end_time: this.mondayEndTime
      }
      meetingTimes.push(mondayWeekdayTime)
    }
    if (this.hasWeekday("Tuesday")) {
      if (this.tuesdayEndTime < this.tuesdayStartTime) {
        this.snackBar.open("Your Club's Tuesday Meeting End Time Can't Be Before Start Time", "", { duration: 4000 })
        return
      }
      var tuesdayWeekdayTime: WeekDayTime = {
        id: undefined,
        day: "Tuesday",
        start_time: this.tuesdayStartTime,
        end_time: this.tuesdayEndTime
      }
      meetingTimes.push(tuesdayWeekdayTime)
    }
    if (this.hasWeekday("Wednesday")) {
      if (this.wednesdayEndTime < this.wednesdayStartTime) {
        this.snackBar.open("Your Club's Wednesday Meeting End Time Can't Be Before Start Time", "", { duration: 4000 })
        return
      }
      var wednesdayWeekdayTime: WeekDayTime = {
        id: undefined,
        day: "Wednesday",
        start_time: this.wednesdayStartTime,
        end_time: this.wednesdayEndTime
      }
      meetingTimes.push(wednesdayWeekdayTime)
    }
    if (this.hasWeekday("Thursday")) {
      if (this.thursdayEndTime < this.thursdayStartTime) {
        this.snackBar.open("Your Club's Thursday Meeting End Time Can't Be Before Start Time", "", { duration: 4000 })
        return
      }
      var thursdayWeekdayTime: WeekDayTime = {
        id: undefined,
        day: "Thursday",
        start_time: this.thursdayStartTime,
        end_time: this.thursdayEndTime
      }
      meetingTimes.push(thursdayWeekdayTime)
    }
    if (this.hasWeekday("Friday")) {
      if (this.fridayEndTime < this.fridayStartTime) {
        this.snackBar.open("Your Club's Friday Meeting End Time Can't Be Before Start Time", "", { duration: 4000 })
        return
      }
      var fridayWeekdayTime: WeekDayTime = {
        id: undefined,
        day: "Friday",
        start_time: this.fridayStartTime,
        end_time: this.fridayEndTime
      }
      meetingTimes.push(fridayWeekdayTime)
    }

    var categories: Category[] = []

    for (var categoryName of this.selectedCategories) {
      var curCategory: Category = {
        id: this.categoryMap.get(categoryName),
        name: categoryName
      }
      categories.push(curCategory)
    }
    
    var potentialClub: PotentialClub = {
      id: undefined,
      name: clubName,
      description: clubDescription,
      founder_id: profile.id ?? undefined,
      meeting_times: meetingTimes,
      categories: categories
    }

    this.registerLeaderService.leaderRegistrationRequestForNonExistingClub(potentialClub).subscribe({
      next: () => this.newClubOnSuccess(),
      error: (err) => this.newClubOnError(err)
    })
  }

  newClubOnSuccess(): void {
    this.snackBar.open("Request Successfully Submitted", "", { duration: 2000 })
  }

  newClubOnError(err: Error): void{
    console.log(err)
    this.snackBar.open("Unable to Submit Request", "", { duration: 2000 })
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

  selectCategory(category: String): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category)
    } else {
      this.selectedCategories.add(category)
    }
  }
}
