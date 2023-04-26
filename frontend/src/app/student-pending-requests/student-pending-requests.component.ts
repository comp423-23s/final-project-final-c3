import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router'
import { isAuthenticated } from 'src/app/gate/gate.guard';
import { Profile, ProfileService } from '../profile/profile.service'
import { PotentialClub, RegisterLeaderService } from '../register-leader.service';
import { profileResolver } from '../profile/profile.resolver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-student-pending-requests',
  templateUrl: './student-pending-requests.component.html',
  styleUrls: ['./student-pending-requests.component.css']
})
export class StudentPendingRequestsComponent {
  public static Route: Route = {
    path: 'student_pending_requests',
    component: StudentPendingRequestsComponent,
    title: 'My Pending Requests',
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  }

  public profile: Profile
  public my_pending_clubs$: Observable<PotentialClub[]>

  constructor(route: ActivatedRoute, private registerLeaderService: RegisterLeaderService) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = data.profile
    this.my_pending_clubs$ = registerLeaderService.getMyPendingClubs()
  }
}
