import { Component } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { Club, ClubsService } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

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
  public joined_clubs$: Observable<Club[]>

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubsService.getAllClubs()
    // this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, is_user_in_club: clubsService.isUserInClub(club)}})}))
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.joined_clubs$ = clubsService.getJoinedClubs()
  }

  // Controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  // Checks whether the current user is already in this club
  isUserInClub(club: Club): boolean {
    // console.log("component isUserInClub called")
    // console.log(this.clubsService.isUserInClub(club))
    var result: boolean = false
    this.clubsService.isUserInClub(club).subscribe(res => result = res)
    return result
  }

  changeStatus(club: Club): void {
    if (this.isUserInClub(club)) {
      this.onLeave(club)
    } else {
      this.onJoin(club)
    }
  }

  // Enables a student to join a club
  onJoin(club: Club): void {
    this.clubsService.joinClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
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
  }

  onError(err: Error): void{
    if (err.message) {
      console.log(err)
      window.alert("The error is: " + err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }

  getShortDescription(club: Club): String {
    if (club.description.length <= 67) {
      return club.description
    }
    return club.description.substring(0, 67) + "..."
  }
}
