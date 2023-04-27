import { Component } from '@angular/core';
import { Profile } from '../profile/profile.service';
import { Observable, map } from 'rxjs';
import { Club, ClubsService } from '../clubs.service';
import { ActivatedRoute, Route } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';

@Component({
  selector: 'app-admin-clubs',
  templateUrl: './admin-clubs.component.html',
  styleUrls: ['./admin-clubs.component.css']
})
export class AdminClubsComponent {
  public static Route: Route = {
    path: 'admin_clubs',
    component: AdminClubsComponent, 
    title: 'All Clubs', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };
  
  public profile: Profile
  public clubs$: Observable<Club[]>

  constructor(route: ActivatedRoute, private clubService: ClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.clubs$ = clubService.getAllClubs()
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

  convertToTime(timeStr: String) {
    var amOrPm: String = "AM"
    var hour: number = parseInt(timeStr.split(":")[0])
    var min: number = parseInt(timeStr.split(":")[1])
    if (hour >= 12) {
      amOrPm = 'PM'
    }
    if (hour > 12) {
      hour = hour - 12
    }
    return `${hour<10?'0':''}${hour}:${min<10?'0':''}${min} ${amOrPm}`
  }
}
