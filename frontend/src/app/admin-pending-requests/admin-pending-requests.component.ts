import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PotentialClub, WeekDayTime, Category } from '../register-leader.service';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminPendingRequestsService } from '../admin-pending-requests.service';

@Component({
  selector: 'app-admin-pending-requests',
  templateUrl: './admin-pending-requests.component.html',
  styleUrls: ['./admin-pending-requests.component.css']
})
export class AdminPendingRequestsComponent {

  public static Route: Route = {
    path: 'admin_pending_requests',
    component: AdminPendingRequestsComponent, 
    title: 'Pending Requests', 
    canActivate: [isAuthenticated], 
    resolve: { profile: profileResolver }
  };

  public profile: Profile
  public potential_clubs$: Observable<PotentialClub[]>

  constructor(route: ActivatedRoute, private adminPendingRequestsService: AdminPendingRequestsService, protected snackBar: MatSnackBar) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.potential_clubs$ = adminPendingRequestsService.getPotentialClubs()
  }

  // A function to approve a potential club request that delegates to the service
  approve(potentialClub: PotentialClub) {
    this.adminPendingRequestsService.approve(potentialClub).subscribe({
      next: () => this.approveOnSuccess(),
      error: (err) => this.approveOnError()
    })
  }

  // When a club is approved, show the user an alert
  approveOnSuccess() {
    this.potential_clubs$ = this.adminPendingRequestsService.getPotentialClubs()
    window.alert("Request was approved by you.")
  }

  // If there is an error, show the following alert:
  approveOnError() {
    window.alert("Request can't be approved.")
  }

  // A function to deny a club request, delegates to the service
  deny(potentialClub: PotentialClub) {
    this.adminPendingRequestsService.deny(potentialClub).subscribe({
      next: () => this.denyOnSuccess(),
      error: (err) => this.denyOnError()
    })
  }

  // If the club was successfully denied, display message
  denyOnSuccess() {
    this.potential_clubs$ = this.adminPendingRequestsService.getPotentialClubs()
    window.alert("Request was denied by you.")
  }

  // If the club could not be denied, display alert message
  denyOnError() {
    window.alert("Request can't be denied.")
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
