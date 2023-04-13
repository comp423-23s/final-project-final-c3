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
  public selectedClubId: number = -1
  public enteredClubCode: String = ""

  public leaderForm = this.formBuilder.group({
    club: '',
    clud_code: 0
  });
  
  constructor(route: ActivatedRoute, private formBuilder: FormBuilder, private registerLeaderService: RegisterLeaderService, private clubService: ClubsService, protected snackBar: MatSnackBar) {
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

  selectionChange(clubId: number) {
    this.selectedClubId = clubId
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
    this.enteredClubCode = clubCode
    this.registerLeaderService.leadereRegistrationRequestForExistingClub(this.selectedClubId, this.enteredClubCode)
  }
}
