import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { Club, ClubsService } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';

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
  // public clubs: Club[]

  constructor(route: ActivatedRoute, private clubsService: ClubsService) {
    const data = route.snapshot.data as { profile: Profile }
    console.log(data)
    this.profile = data.profile
    this.clubs$ = clubsService.getAllClubs()
    // this.clubs = [...this.clubsService.getAllClubs()]
    // for (var club of this.clubs$) {
    //   club.show_short_description = true
    // }
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
  }

  // controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  isUserInClub(club: Club): boolean {
    var joinedClubsArray: Club[] = new Array()
    const subscription = this.clubsService.getJoinedClubs(this.profile.pid).subscribe((joinedClubs) => {
      joinedClubsArray = joinedClubs
    })
    for (var joinedClub of joinedClubsArray) {
      if (joinedClub.cid == club.cid) {
        return true
      }
    }
    return false
  }
  // isUserInClub(club: Club): boolean {
  //   var joinedClubsArray = this.clubsService.getJoinedClubs(this.profile.pid)
  //   for (var joinedClub of joinedClubsArray) {
  //     if (joinedClub == club) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  changeStatus(club: Club): void {
    if (this.isUserInClub(club)) {
      this.leaveClub(club)
    } else {
      this.joinClub(club)
    }
    this.clubs$ = this.clubsService.getAllClubs()
  }

  joinClub(club: Club): void {
    this.clubsService.joinClub(this.profile.pid, club).subscribe({
      next: () => this.onSuccess(),
    })
  }
  // joinClub(club: Club): void {
  //   this.clubsService.joinClub(this.profile.pid, club.name)
  //   this.clubs = this.clubsService.getAllClubs()
  // }

  leaveClub(club: Club): void {
    this.clubsService.leaveClub(this.profile.pid, club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }
  // leaveClub(club: Club): void {
  //   this.clubsService.leaveClub(this.profile.pid, club.name)
  //   this.clubs = this.clubsService.getAllClubs()
  // }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getJoinedClubs(123456789)
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
