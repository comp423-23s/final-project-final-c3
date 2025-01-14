import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

/* HTTP and Auth */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './navigation/http-request.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
/* UI / Material Dependencies */
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { NgForOf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table'
/* Application Specific */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ErrorDialogComponent } from './navigation/error-dialog/error-dialog.component';
import { HomeComponent } from './home/home.component';
import { GateComponent } from './gate/gate.component';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { EventsComponent } from './events/events.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { JoinedClubsComponent } from './joined-clubs/joined-clubs.component';
import { ClubsComponent } from './clubs/clubs.component';
import { RegisterLeaderComponent } from './register-leader/register-leader.component';
import { RegisterEventComponent } from './register-event/register-event.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { LeaderClubsComponent } from './leader-clubs/leader-clubs.component';
import { AdminPendingRequestsComponent } from './admin-pending-requests/admin-pending-requests.component';
import { ChangeAdminComponent } from './change-admin/change-admin.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { AdminClubsComponent } from './admin-clubs/admin-clubs.component';
import { AdminClubMembersListComponent } from './admin-clubs/list/members/admin-club-members-list.component';
import { AdminClubLeadersListComponent } from './admin-clubs/list/leaders/admin-club-leaders-list.component';
import { AdminClubEventsListComponent } from './admin-clubs/list/events/admin-club-events-list.component';
import { LeaderClubMembersListComponent } from './leader-clubs/leader-club-members-list/leader-club-members-list.component';
import { StudentPendingRequestsComponent } from './student-pending-requests/student-pending-requests.component';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ErrorDialogComponent,
    HomeComponent,
    GateComponent,
    ProfileEditorComponent,
    EventsComponent,
    MyEventsComponent,
    ClubsComponent,
    JoinedClubsComponent,
    RegisterLeaderComponent,
    RegisterEventComponent,
    RoleSelectionComponent,
    LeaderClubsComponent,
    AdminPendingRequestsComponent,
    ManageEventsComponent,
    AdminClubsComponent,
    AdminClubMembersListComponent,
    AdminClubLeadersListComponent,
    AdminClubEventsListComponent,
    ChangeAdminComponent,
    ManageEventsComponent,
    LeaderClubMembersListComponent,
    StudentPendingRequestsComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgForOf,
    AppRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTableModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("bearerToken")
        }
      }
    }),
    FormsModule,
    MatSelectModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRequestInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}