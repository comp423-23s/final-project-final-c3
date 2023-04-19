import { Component } from '@angular/core';
import { Observable, fromEventPattern, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Club, ClubsService } from '../clubs.service';
import { PotentialClub, WeekDayTime, RegisterLeaderService } from '../register-leader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { AriaDescriber } from '@angular/cdk/a11y';
import { ProfileService } from '../profile/profile.service';

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
  public weekdays = ["Mon", "Tue", "Wed", "Thur", "Fri"]
  public categories = ["Women", "Hackathon", "Volunteer"]
  public selectedWeekdays = new Set()
  public selectedCategories = new Set()

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
    var potentialClub: PotentialClub = {
      id: undefined,
      name: clubName,
      description: clubDescription,
      founder_id: profile.id ?? undefined,
      meeting_times: [],
      categories: []
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
