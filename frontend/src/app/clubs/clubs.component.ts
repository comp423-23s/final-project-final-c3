import { Component, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile, ProfileService } from '../profile/profile.service'
import { Club, ClubsService, User_Club } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ProfileEditorComponent } from '../profile/profile-editor/profile-editor.component';

@Injectable({
  providedIn: 'root'
})
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
  public profile$: Observable<Profile | undefined>
  public clubs$: Observable<Club[]>
  public user_clubs$: Observable<User_Club[]>
  // static profile: Profile;

  constructor(route: ActivatedRoute, private clubsService: ClubsService, protected snackBar: MatSnackBar, private profileService: ProfileService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.profile$ = profileService.profile$
    this.clubs$ = clubsService.getAllClubs()
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.user_clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club: User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
  }

  // Controls which description is rendered on screen (short or long)
  alterText(club: Club) {
    club.show_short_description = !club.show_short_description
  }

  changeStatus(user_club: User_Club): void {
    if (user_club.is_joined) {
      this.onLeave(user_club.club)
    } else {
      this.onJoin(user_club.club)
    }
  }

  // Enables a student to join a club
  onJoin(club: Club): void {
    this.profileService.http.get<Profile>('/api/profile').subscribe(
      {
        next: (data) => {this.onSuccessUpdateProfile(data)},
        error: (err) => console.log(err)
      }
    )
    this.clubsService.joinClub(club).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
  }

  private onSuccessUpdateProfile(profile: Profile): void {
    this.profile = profile
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
    this.clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {return clubs.map(club => {return {...club, show_short_description: true}})}))
    this.user_clubs$ = this.clubs$.pipe(map((clubs: Club[]) => {
      return clubs.map(a_club => {
        const user_club : User_Club = {
          club: a_club, 
          is_joined: a_club.members.map(member => member.id).includes(this.profile.id)
        }
        return user_club
      })
    }))
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
