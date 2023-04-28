import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service';
import { Club, ClubsService } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    console.log(route.snapshot)
    this.profile = data.profile
    this.clubs$ = clubsService.getJoinedClubs()
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
  }

  // Controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  // Enables a student to leave a club
  leaveClub(club: Club): void {
    this.clubsService.leaveClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  onSuccess(): void {
    this.clubs$ = this.clubsService.getJoinedClubs()
  }

  onError(err: Error) : void{
    if (err.message) {
      console.log(err)
      this.snackBar.open("⚠️ Couldn't get your clubs! This isn't your fault, but something went wrong. Please try again later." , "", { duration: 4000 })
    } else {
      this.snackBar.open("⚠️ Couldn't get your clubs! This isn't your fault but something went wrong. Please try again later." , "", { duration: 4000 })
    }
  }

  // A functino to get the shortened version of a club's description
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
