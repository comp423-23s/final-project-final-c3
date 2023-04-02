import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service';
import { Club, ClubsService } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';

@Component({
  selector: 'app-joined-clubs',
  templateUrl: './joined-clubs.component.html',
  styleUrls: ['./joined-clubs.component.css']
})
export class JoinedClubsComponent {
  
  public static Route: Route = {
    path: 'joined_clubs',
    component: JoinedClubsComponent, 
    title: 'Joined Clubs', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public clubs$: Observable<Club[]>
  // public clubs: Club[]

  constructor(route: ActivatedRoute, private clubsService: ClubsService) {
    const data = route.snapshot.data as { profile: Profile }
    console.log(route.snapshot)
    this.profile = data.profile
    this.clubs$ = clubsService.getJoinedClubs(123456789)
    // this.clubs = [...this.clubsService.getJoinedClubs(this.profile.pid)]
    // for (var club of this.clubs) {
    //   club.show_short_description = true
    // }
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
  }

  // controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  leaveClub(club: Club): void {
    // this.clubsService.leaveClub(this.profile.pid, club.name)
    // console.log(this.clubsService.getJoinedClubs(this.profile.pid))
    // this.clubs = this.clubsService.getJoinedClubs(this.profile.pid)
    this.clubsService.leaveClub(this.profile.pid, club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getJoinedClubs(123456789)
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      window.alert(err.message);
    } else {
      window.alert("Unknown error: " + JSON.stringify(err));
    }
  }
}
