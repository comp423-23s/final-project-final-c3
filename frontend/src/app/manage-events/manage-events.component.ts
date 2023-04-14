import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Event, EventService } from '../event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent {
  public static Route: Route = {
    path: 'manageevents',
    component: ManageEventsComponent, 
    title: 'Manage Events', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public club_events$: Observable<Event[]>

  constructor(private eventService: EventService, protected snackBar: MatSnackBar) {
    // TODO: get events by club not just all events
    this.club_events$ = eventService.getAllEvents()
  }

  getShortDescription(event: Event): String {
    if (event.description.length <= 25) {
      return event.description
    }
    return event.description.substring(0, 25) + "..."
  }

  alterText(event: Event) {
    event.show_short_description = !event.show_short_description
  }

  onDelete(event: Event) {
    this.eventService.deleteEvent(event).subscribe({
      next: () => this.onSuccess(),
      error: (err) => this.onError(err)
    })
    this.snackBar.open("Successfully deleted " + event.name, "", { duration: 2000 })
  }

  onSuccess(): void {
    this.club_events$ = this.eventService.getAllEvents()
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
