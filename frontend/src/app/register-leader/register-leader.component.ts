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
  public selectedClub: Club = {id: 0, name: "Dummy Club", description: "dummy description", show_short_description: true, members: []}
  public selectedClubId: number = 0
  public enteredClubCode: String = ""

  public leaderForm = this.formBuilder.group({
    club: '',
    clud_code: 0
  });
  
  constructor(route: ActivatedRoute, private formBuilder: FormBuilder, private registerLeaderService: RegisterLeaderService, private clubService: ClubsService, protected snackBar: MatSnackBar, private navigationComponent: NavigationComponent, private roleAdminService: RoleAdminService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
  }

  // setClubExist() {
  //   this.clubExists = true
  // }

  // setClubNotExist() {
  //   this.clubExists = false
  // }

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

  leadereRegistrationRequestForExistingClub() {
    if (this.selectedClubId != -1 && this.enteredClubCode.length != 0) {
      this.registerLeaderService.leadereRegistrationRequestForExistingClub(this.selectedClubId, this.enteredClubCode)
    }
  }

  // leaderRegistrationRequestForNonExistingClub() {
  //   const potentialClub: PotentialClub = {
  //     id: 1,
  //     name: this.newClubName ?? "",
  //     description: this.newClubDescription ?? "",
  //     founder_id: this.profile.id || 0
  //   }
  //   this.registerLeaderService.leaderRegistrationRequestForNonExistingClub(potentialClub)
  // }

  onSubmit(clubCode: String): void {
    console.log("frontend onSubmit() called")
    this.enteredClubCode = clubCode
    this.registerLeaderService.leadereRegistrationRequestForExistingClub(this.selectedClubId, this.enteredClubCode).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    // this.navigationComponent.roles$ = this.roleAdminService.list_my_roles();
  }

  onError(err: Error): void{
    console.log(err)
    window.alert("Wrong club code. Leader registration request denied.");
  }
}
