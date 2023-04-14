import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PotentialClub } from '../register-leader.service';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile } from '../profile/profile.service'
import { Club, ClubsService, User_Club } from '../clubs.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { LeaderClubsService } from '../leader-clubs.service';
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
    title: 'Pneding Requests', 
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

  approve(potentialClub: PotentialClub) {
    this.adminPendingRequestsService.approve(potentialClub).subscribe({
      next: () => this.approveOnSuccess(),
      error: (err) => this.approveOnError()
    })
  }

  approveOnSuccess() {
    this.potential_clubs$ = this.adminPendingRequestsService.getPotentialClubs()
    window.alert("Request was approved by you.")
  }

  approveOnError() {
    window.alert("Request can't be approved.")
  }

  deny(potentialClub: PotentialClub) {
    this.adminPendingRequestsService.deny(potentialClub).subscribe({
      next: () => this.denyOnSuccess(),
      error: (err) => this.denyOnError()
    })
  }

  denyOnSuccess() {
    this.potential_clubs$ = this.adminPendingRequestsService.getPotentialClubs()
    window.alert("Request was denied by you.")
  }

  denyOnError() {
    window.alert("Request can't be denied.")
  }
}
