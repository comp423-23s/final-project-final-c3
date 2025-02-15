import { Component } from '@angular/core';
import { Observable, Subscription, map, of } from 'rxjs';
import { Role } from '../role';
import { RoleAdminService } from '../admin/roles/role-admin.service';
import { RoleRoute } from '../navigation/navigation.service';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { profileResolver } from '../profile/profile.resolver';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.css']
})
export class RoleSelectionComponent {

  public static Route: Route = {
    path: 'role_selection',
    component: RoleSelectionComponent,
    title: 'Select Your Role',
    canActivate: [isAuthenticated],
    resolve: { profile: profileResolver }
  };
  
  public roles$: Observable<Role[]>
  public role_routes$: Observable<RoleRoute[]>

  constructor(public router: Router, private roleAdminService: RoleAdminService, private navigationComponent: NavigationComponent) {
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
  }

  routeTo(e: Object) {
    this.router.navigate(['/' + e]);
  }

  selectionChange(roleName: string) {
    if (roleName == "Student") {
      this.navigationComponent.roleName = "Student"
    } else if (roleName === "Leader") {
      this.navigationComponent.roleName = "Leader"
    } else {
      this.navigationComponent.roleName = "Administrator"
    }
  }
}
