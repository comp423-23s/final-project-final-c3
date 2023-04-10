import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { Club, ClubsService } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  // public joinedClubsArray: Club[] = new Array()
  public joined_clubs$: Observable<Club[]>

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    console.log(data)
    this.profile = data.profile
    this.clubs$ = clubsService.getAllClubs()
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.joined_clubs$ = clubsService.getJoinedClubs()
  }

  // controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  // private onJoin(club: Club) {
  //   this.snackBar.open("Successfully joined " + club.name, "", { duration: 2000 })
  // }

  private onLeave(club: Club) {
    this.snackBar.open("Successfully joined " + club.name, "", { duration: 2000 })
  }

  isUserInClub(club: Club): boolean {
    return this.clubsService.isUserInClub(club)
  }

  changeStatus(club: Club): void {
    this.onJoin(club)
    // this.joinClub(club)
    // var joinedClubsArray: Club[] = new Array()
    // const subscription = this.clubsService.getJoinedClubs().subscribe((joinedClubs) => {
    //   joinedClubsArray = joinedClubs
    // })
    // console.log(joinedClubsArray.length)

    // this.leaveClub(club)
    // if (this.isUserInClub(club)) {
    //   this.leaveClub(club)
    // } else {
    //   this.joinClub(club)
    // }
    // this.clubs$ = this.clubsService.getAllClubs()
  }

  onJoin(club: Club): void {
    this.clubsService.joinClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  leaveClub(club: Club): void {
    this.clubsService.leaveClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getAllClubs()
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      window.alert("The error is: " + err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }
}
