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

  onSubmitEvent(club_code: string, name: string, description: string, location: string, start: string, end: string): void {
    // TODO: change parameters to right types
    console.log("STEP 0: Call this.getClubID below")
    this.getClubID(club_code, name, description, location, start, end)
    
  }

  getClubID(club_code: string, name: string, description: string, location: string, start: string, end: string): void {
    console.log("STEP 1: In getClubID now, subscribe to service below: ")
    this.eventService.getClubID(club_code).subscribe(
      {
        next: (data) => {this.onSuccessGetClubID(data, name, description, location, start, end )},
        error: (err) => {this.onError(err)}
      }
    )
    
  }

  onSuccessGetClubID(club_id: number, name: string, description: string, location: string, start: string, end: string): void {
    console.log("STEP 2: On Success, assign this.club_id to the data value of:")
    console.log(club_id)
    let start_time: Date = new Date(start)
    let end_time: Date = new Date(end)
    var event: Event = {
      id: null,
      club_id: club_id,
      name: name,
      description: description,
      location: location,
      start_time: start_time,
      end_time: end_time,
      show_short_description: false,
      attendees: []
    } 
    console.log("STEP 3: Check event club_id: ")   
    console.log(event.club_id)
    this.eventService.createNewEvent(event).subscribe(
      {
        next: (data) => {this.onSuccess(data)},
        error: (err) => {this.onError(err)}
      }
    )
  
  }

  private onSuccess(string: string) {
    this.snackBar.open("Event Created", "", { duration: 2000 })
  }

  private onError(err: any) {
    console.error("How to handle this?");
  }
}