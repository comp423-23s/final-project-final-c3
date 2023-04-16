import { Component } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { Club, ClubsService, User_Club } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { LeaderClubsService } from '../leader-clubs.service';

@Component({
  selector: 'app-leader-clubs',
  templateUrl: './leader-clubs.component.html',
  styleUrls: ['./leader-clubs.component.css']
})
export class LeaderClubsComponent {
  
  public static Route: Route = {
    path: 'leader_clubs',
    component: LeaderClubsComponent, 
    title: 'Leading Clubs', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public clubs$: Observable<Club[]>

  constructor(route: ActivatedRoute, private leaderClubsService: LeaderClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = leaderClubsService.getLeadingClubs()
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
  }

  // A function to change whether or not a user sees the short description for a club
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  // A function to get the shortened version of a club's description
  getShortDescription(club: Club): String {
    if (club.description.length <= 67) {
      return club.description
    }
    return club.description.substring(0, 67) + "..."
  }
}
