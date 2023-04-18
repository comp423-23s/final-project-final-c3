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

  onSubmitEvent(club_code: string, name: string, description: string, location: string): void {
    // TODO: change parameters to right types
    let club_id = this.getClubID(club_code)
    let date_number: number = Date.now()
    let date: Date = new Date(date_number)
    var potentialEvent: Event = {
      id: undefined,
      club_id: club_id,
      name: name,
      description: description,
      location: location,
      date: date,
      show_short_description: true,
      attendees: []
    }
    this.eventService.createNewEvent(potentialEvent)
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

  onSuccessGetClubID(club_id: number): number {
    return club_id
  }

  private onSuccess(event: Event) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }
}