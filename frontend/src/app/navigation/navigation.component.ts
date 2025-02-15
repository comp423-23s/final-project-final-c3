import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {MatMenuModule} from '@angular/material/menu';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleRoute, NavigationService as NavigationTitleService } from './navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile, ProfileService } from '../profile/profile.service';
import { PermissionService } from '../permission.service';
import { Role } from '../role';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { ProfileEditorComponent } from '../profile/profile-editor/profile-editor.component';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [ProfileEditorComponent]
})
export class NavigationComponent implements OnInit, OnDestroy {

  private errorDialogSubscription!: Subscription;

  public isHandset: boolean = false;
  private isHandsetSubscription!: Subscription;

  public profile$: Observable<Profile | undefined>;
  public profile: Profile
  public checkinPermission$: Observable<boolean>;
  public adminPermission$: Observable<boolean>;

  public roles$: Observable<Role[]>;

  public roleName = "Student"

  currentRoute: string = "/"

  role_routes$: Observable<RoleRoute[]>
  role_routes = [
    {
      value: 'student',
      display: 'Student'
    },
    {
      value: 'leader',
      display: 'Leader'
    }
  ]

  club_routes = [
    {
      value: 'all_clubs',
      display: 'All Clubs'
    },
    {
      value: 'joined_clubs',
      display: 'My Clubs'
    }
  ]

  event_routes = [
    {
      value: 'events',
      display: 'All Events'
    },
    {
      value: 'my-events',
      display: 'My Events'
    }
  ]
menu: any;

  leader_event_routes =[
    {
      value: 'registerevents',
      display: 'Register Events'
    },
    {
      value: 'manageevents',
      display: 'Manage Events'
    }
  ]

  constructor(
    public auth: AuthenticationService,
    public router: Router,
    private permission: PermissionService,
    private profileService: ProfileService,
    private roleAdminService: RoleAdminService,
    private breakpointObserver: BreakpointObserver,
    protected navigationService: NavigationTitleService,
    protected errorDialog: MatDialog,
    protected route: ActivatedRoute,
    private profileComponent: ProfileEditorComponent
  ) {
    const data = route.snapshot.data as { profile: Profile }
    this.profile = profileComponent.profile;
    this.profile$ = profileService.profile$;
    this.checkinPermission$ = this.permission.check('checkin.create', 'checkin/');
    this.adminPermission$ = this.permission.check('admin.view', 'admin/')
    this.roles$ = this.roleAdminService.list_my_roles();
    this.role_routes$ = this.roles$.pipe(map((roles: Role[]) => {
      return roles.map(a_role => {
        const role_route: RoleRoute = {
          value: 'register_'+a_role.name.toLowerCase(),
          display: a_role.name
        }
        return role_route
      })
    }))
    console.log("We are logging the profile here")
    console.log(this.profile)
  }

  routeTo(e: Object) {
    this.router.navigate(['/' + e]);
  }

  ngOnInit(): void {
    this.errorDialogSubscription = this.initErrorDialog();
    this.isHandsetSubscription = this.initResponsiveMenu();
    this.currentRoute = '/profile';
    this.profileService.http.get<Profile>('/api/profile').subscribe(
      {
        next: (data) => {this.onSuccessUpdateProfile(data)},
        error: (err) => console.log(err)
      }
    )
  }

  private onSuccessUpdateProfile(profile: Profile): void {
    this.profile = profile
    console.log(this.profile)
  }

  ngOnDestroy(): void {
    this.errorDialogSubscription.unsubscribe();
    this.isHandsetSubscription.unsubscribe();
  }

  hideMobileSidenav(nav: MatSidenav): void {
    if (this.isHandset) {
      nav.close();
    }
  }

  private initErrorDialog() {
    return this.navigationService.error$.subscribe(
      (message) => {
        if (message !== null) {
          console.log(message)
          // this.errorDialog.open(ErrorDialogComponent, { data: { message } });
        }
      }
    );
  }

  private initResponsiveMenu() {
    return this.breakpointObserver
        .observe(Breakpoints.HandsetPortrait)
        .pipe(map(result => result.matches))
        .subscribe(isHandset => this.isHandset = isHandset);
  }

  // checkIsNotLeader(): Observable<boolean> {
  //   this.roles$.pipe(
  //       map(roles => {
  //       if(roles.find(role => role.name=="Student")) {
  //           console.log("find student")
  //           return of(false)
  //       } else {
  //           return of(true)
  //       }
  //       })
  //   )
  //   return of(true)
  // }
}
