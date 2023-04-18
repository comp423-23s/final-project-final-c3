import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { FormBuilder, Validators } from '@angular/forms';
import { Event, EventService } from '../event.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-event',
  templateUrl: './register-event.component.html',
  styleUrls: ['./register-event.component.css']
})
export class RegisterEventComponent {
  public static Route: Route = {
    path: 'registerevents',
    component: RegisterEventComponent, 
    title: 'Register Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  constructor(protected snackBar: MatSnackBar, private eventService: EventService) {
  
  }

  onSubmitEvent(club_code: string, name: string, description: string, location: string, date: string): void {
    // TODO: change parameters to right types

    // TODO: get club id by club code
    
  }

  getClubID(club_code: string): number {
    this.eventService.getClubID(club_code).subscribe(
      {
        next: (data) => {return this.onSuccessGetClubID(data)},
        error: (err) => console.log(err)
      }
    )
    return 0
  }

  onSuccessGetClubID(club_id: string): number {
    let id = club_id
    return parseInt(id)
  }

  private onSuccess(event: Event) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }
}