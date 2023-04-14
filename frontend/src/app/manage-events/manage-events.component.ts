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

  constructor(private eventService: EventService, protected snackbar: MatSnackBar) {
    // TODO: get events by club not just all events
    this.club_events$ = eventService.getAllEvents()
  }

  getShortDescription(event: Event): String {
    if (event.description.length <= 25) {
      return event.description
    }
    return event.description.substring(0, 25) + "..."
  }

}
