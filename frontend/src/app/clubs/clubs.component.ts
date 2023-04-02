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
  // public joinedClubsArray: Club[] = new Array()
  public joined_clubs$: Observable<Club[]>

  constructor(route: ActivatedRoute, private clubsService: ClubsService) {
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

  // isUserInClub(club: Club): boolean {
  //   var joinedClubsArray: Club[] = new Array()
  //   const subscription = this.clubsService.getJoinedClubs(this.profile.pid).subscribe((joinedClubs) => {
  //     joinedClubsArray = joinedClubs
  //   })
  //   for (var joinedClub of joinedClubsArray) {
  //     if (joinedClub.cid == club.cid) {
  //       return true
  //     }
  //   }
  //   return false
  // }
  isUserInClub(club: Club): boolean {
    // for (var joinedClub of this.joinedClubsArray) {
    //   if (joinedClub.id == club.id) {
    //     console.log("user is in club")
    //     return true
    //   }
    // }
    // console.log("user not in club")
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
  // isUserInClub(club: Club): boolean {
  //   for (var member of club.members) {
  //     if (member == this.profile.pid) {
  //       return true
  //     }
  //   }
  //   return false
  // }

  changeStatus(club: Club): void {
    this.joinClub(club)
    var joinedClubsArray: Club[] = new Array()
    const subscription = this.clubsService.getJoinedClubs().subscribe((joinedClubs) => {
      joinedClubsArray = joinedClubs
    })
    console.log(joinedClubsArray.length)

    // this.leaveClub(club)
    // if (this.isUserInClub(club)) {
    //   this.leaveClub(club)
    // } else {
    //   this.joinClub(club)
    // }
    // this.clubs$ = this.clubsService.getAllClubs()
  }

  joinClub(club: Club): void {
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
