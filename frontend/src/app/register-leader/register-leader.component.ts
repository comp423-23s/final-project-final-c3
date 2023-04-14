import { Component } from '@angular/core';
import { Observable, fromEventPattern, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Club, ClubsService } from '../clubs.service';
import { PotentialClub, RegisterLeaderService } from '../register-leader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { AriaDescriber } from '@angular/cdk/a11y';

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
  public selectedClub: Club = {id: 0, club_code: "ABCD1234", name: "Dummy Club", description: "dummy description", show_short_description: true, members: []}
  public selectedClubId: number = 0
  public clubExists = true
  public potentialClubId = 0
  
  constructor(route: ActivatedRoute, private formBuilder: FormBuilder, private registerLeaderService: RegisterLeaderService, private clubService: ClubsService, protected snackBar: MatSnackBar, private navigationComponent: NavigationComponent, private roleAdminService: RoleAdminService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
  }

  changeClubExistStatus() {
    this.clubExists = !this.clubExists
  }

  selectionChange(clubName: string) {
    if (clubName == "Pearl Hacks") {
      this.selectedClubId = 1
    } else if (clubName == "App Team") {
      this.selectedClubId = 2
    } else if (clubName == "CSSG") {
      this.selectedClubId = 3
    } else if (clubName == "HackNC") {
      this.selectedClubId = 4
    } else if (clubName == "WiCS") {
      this.selectedClubId = 5
    }
    console.log("selected club id is " + this.selectedClubId)
  }

  onSubmitExistingClub(clubCode: String): void {
    this.registerLeaderService.leaderRegistrationRequestForExistingClub(this.selectedClubId, clubCode).subscribe({
      next: () => this.existingClubOnSuccess(),
      error: (err) => this.existingClubOnError(err)
    })
  }

  existingClubOnSuccess(): void {
    // this.navigationComponent.roles$ = this.roleAdminService.list_my_roles();
    window.alert("Leader registration was successful.")
  }

  existingClubOnError(err: Error): void{
    console.log(err)
    window.alert("Wrong club code. Leader registration request denied.");
  }

  onSubmitNewClub(clubName: string, clubDescription: string): void {
    if (clubName.length != 0 && clubDescription.length != 0) {
      var potentialClub: PotentialClub = {
        id: undefined,
        name: clubName,
        description: clubDescription,
        founder_id: this.profile.id ?? undefined
      }
      this.registerLeaderService.leaderRegistrationRequestForNonExistingClub(potentialClub).subscribe({
        next: () => this.newClubOnSuccess(),
        error: (err) => this.newClubOnError(err)
      })
    } else {
      window.alert("Please enter club name and description.")
    }
  }

  newClubOnSuccess(): void {
    // this.navigationComponent.roles$ = this.roleAdminService.list_my_roles();
    window.alert("Request was submitted.")
  }

  newClubOnError(err: Error): void{
    console.log(err)
    window.alert("Request can't be submitted.")
  }
}
