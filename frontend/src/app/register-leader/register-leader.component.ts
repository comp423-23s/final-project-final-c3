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

  public clubExists: boolean
  public curClub: Club | undefined
  public curClubCode: String | undefined

  public newClubName: String | undefined
  public newClubDescription: String | undefined
  
  constructor(route: ActivatedRoute, private formBuilder: FormBuilder, private registerLeaderService: RegisterLeaderService, private clubService: ClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
    this.clubExists = false
  }

  setClubExist() {
    this.clubExists = true
  }

  setClubNotExist() {
    this.clubExists = false
  }

  leadereRegistrationRequestForExistingClub() {
    if (this.curClub != undefined && this.curClubCode != undefined) {
      this.registerLeaderService.leadereRegistrationRequestForExistingClub(this.curClub, this.curClubCode)
    }
  }

  leaderRegistrationRequestForNonExistingClub() {
    const potentialClub: PotentialClub = {
      id: 1,
      name: this.newClubName ?? "",
      description: this.newClubDescription ?? "",
      founder_id: this.profile.id || 0
    }
    this.registerLeaderService.leaderRegistrationRequestForNonExistingClub(potentialClub)
  }

  onSubmit(): void {

  }
}
