import { Component } from '@angular/core';
import { Observable, fromEventPattern, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Club, ClubsService } from '../clubs.service';
import { PotentialClub, WeekDayTime, Category, RegisterLeaderService } from '../register-leader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { AriaDescriber } from '@angular/cdk/a11y';
import { ProfileService } from '../profile/profile.service';
import { Time, WeekDay } from '@angular/common';

@Component({
  selector: 'app-register-leader',
  templateUrl: './register-leader.component.html',
  styleUrls: ['./register-leader.component.css']
})
export class RegisterLeaderComponent {

  public static Route: Route = {
    path: 'register_leader',
    component: RegisterLeaderComponent,
    title: 'Register Leader',
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public clubs$: Observable<Club[]>
  public selectedClub: Club = {id: 0, club_code: "ABCD1234", name: "Dummy Club", description: "dummy description", show_short_description: true, members: [], club_meeting_times: [], categories: []}
  public selectedClubId: number = 0
  public clubExists = true
  public potentialClubId = 0
  public categories = ["Womxn", "Black/African American", "Asian American/Pacific Islander", "Hispanic/Latinx", "LGBTQIA+", "Video Games", "Hackathon", "Non-Binary", "Volunteer", "iOS Development", "Business", "Project Management"]
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

  constructor(route: ActivatedRoute, private formBuilder: FormBuilder, private registerLeaderService: RegisterLeaderService, private clubService: ClubsService, protected snackBar: MatSnackBar, private navigationComponent: NavigationComponent, private roleAdminService: RoleAdminService, private profileService: ProfileService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
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
    // this.navigationComponent.roles$ = this.roleAdminService.list_my_roles();
    window.alert("Leader registration was successful.")
  }

  //Function that displays error message if the club code was incorrect
  existingClubOnError(err: Error): void{
    console.log(err)
    window.alert("Wrong club code. Leader registration request denied.");
  }

  onSubmitNewClub(clubName: string, clubDescription: string): void {
    if (clubName.length != 0 && clubDescription.length != 0) {
      this.profileService.http.get<Profile>('/api/profile').subscribe(
        {
          next: (data) => {this.onSuccessUpdateProfile(data, clubName, clubDescription)},
          error: (err) => console.log(err)
        }
      )
    } else {
      window.alert("Please enter club name and description.")
    }
  }

  private onSuccessUpdateProfile(profile: Profile, clubName: String, clubDescription: string): void {
    var meetingTimes: WeekDayTime[] = []
    if (this.hasWeekday("Monday")) {
      var startTimeObj: Time = {
        hours: Number(this.mondayStartTime.slice(0, 2)),
        minutes: Number(this.mondayStartTime.slice(3, 5))
      }
      var endTimeObj: Time = {
        hours: Number(this.mondayEndTime.slice(0, 2)),
        minutes: Number(this.mondayEndTime.slice(3, 5))
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
      var startTimeObj: Time = {
        hours: Number(this.tuesdayStartTime.slice(0, 2)),
        minutes: Number(this.tuesdayStartTime.slice(3, 5))
      }
      var endTimeObj: Time = {
        hours: Number(this.tuesdayEndTime.slice(0, 2)),
        minutes: Number(this.tuesdayEndTime.slice(3, 5))
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
      var startTimeObj: Time = {
        hours: Number(this.wednesdayStartTime.slice(0, 2)),
        minutes: Number(this.wednesdayStartTime.slice(3, 5))
      }
      var endTimeObj: Time = {
        hours: Number(this.wednesdayEndTime.slice(0, 2)),
        minutes: Number(this.wednesdayEndTime.slice(3, 5))
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
      var startTimeObj: Time = {
        hours: Number(this.thursdayStartTime.slice(0, 2)),
        minutes: Number(this.thursdayStartTime.slice(3, 5))
      }
      var endTimeObj: Time = {
        hours: Number(this.thursdayEndTime.slice(0, 2)),
        minutes: Number(this.thursdayEndTime.slice(3, 5))
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
      var startTimeObj: Time = {
        hours: Number(this.fridayStartTime.slice(0, 2)),
        minutes: Number(this.fridayStartTime.slice(3, 5))
      }
      var endTimeObj: Time = {
        hours: Number(this.fridayEndTime.slice(0, 2)),
        minutes: Number(this.fridayEndTime.slice(3, 5))
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
        id: undefined,
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
    window.alert("Request was submitted.")
  }

  newClubOnError(err: Error): void{
    console.log(err)
    window.alert("Request can't be submitted.")
  }

  selectDay(weekday: String): void {
    if (this.selectedWeekdays.has(weekday)) {
      this.selectedWeekdays.delete(weekday)
    } else {
      this.selectedWeekdays.add(weekday)
    }
  }

  selectCategory(category: String): void {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category)
    } else {
      this.selectedCategories.add(category)
    }
  }

  hasWeekday(weekday: String): boolean {
    return this.selectedWeekdays.has(weekday)
  }
}
