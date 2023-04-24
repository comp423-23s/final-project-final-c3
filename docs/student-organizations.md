# Overview

Our website builds off the [Computer Science Experience Lab website](https://csxl.unc.edu/), with added functionality to view affiliated student clubs and the events they host. This application serves students at the University of North Carolina at Chapel Hill who are interested in becoming involved in Computer Science related organizations. Using this application, students have quick and easy access to enriching events and inclusive organizations. 

As a student, one may:
* View a comprehensive list of all computer science affiliated clubs
* View a comprehensive list of all events hosted by these clubs
* Join or Leave a club
* Register or Cancel Registration for an event
* View the clubs of which they are currently members 
* View the events for which they are currently registered
* Search through clubs via filtering, either by availability or interests (categories)
* Become a leader of a club:
    - Either: become a leader of an existing club: student needs to select the club from a dropdown box, and submit a 8-digit Club Code
        - If the Club Code is correct, then the student becomes the leader of this club
        - If the Club Code is incorrect, then the student can't become the leader of the club
    - Or: become a leader of a new club: student needs to submit the club name and description, and the request will be submitted for Administrator Arden to review (accessed by: https://team-c3-comp423-23s.apps.cloudapps.unc.edu/auth/as/arden/100000001) 
        - If the request is approved by Administrator, then the club is founded and assigned with a Club Code, and the student becomes the leader of the club
        - If the request is denied by Administrator, then the club is not founded and the student is not the leader of the club
    * If the student successfully becomes a leader, the student will be able to switch to Leader view in "Change Role" tab in the navigation bar

As a leader of a club (e.g. President), one may:
* View a list of the clubs they lead
* View the 8-digit Club Code of the clubs they lead
* View the members in the clubs they lead

As an administrator, one may:
* Approve or deny a student's request to create a new club


# Implementation Notes

In order to implement our application, we choose to have the following base entities:

<table>
  <tr>
   <td>
Name
   </td>
   <td>Description
   </td>
   <td>Attributes
   </td>
  </tr>
  <tr>
   <td>Club Entity
   </td>
   <td>There are many organizations that might be a part of the UNC XL. Each one needs to have the following information: an id (int), a club_code (int) used by leaders of the club, a name(str), a description (str) for users, a list of members (List[UserEntity]), and a list of leaders (List[UserEntity])
   </td>
   <td>id, club_code, name, description, members, leaders
   </td>
  </tr>
  <tr>
   <td>Event Entity
   </td>
   <td>Each event hosted by a club has its own entity. It has an id (int), a name (str), a description of the event (str), a location for the event (str), the date that it occurs (datetime), a club_id to match the event to the corresponding club (int), and a list of attendees (List[UserEntity])
   </td>
   <td>id, name, location, description, date, club_id, attendees
   </td>
  </tr>
  <tr>
   <td>Potential Club Entity
   </td>
   <td>Before a club can be declared an official club entity, it must be approved by an administrator. Thus, it remains as a ‘potential club entity’ until it is approved. These entities are composed of an id (int), a name (str), a description (str), and a founder_id (UserEntity) to represent who started the club. 
   </td>
   <td>id, name, description, founder_id
   </td>
  </tr>
  <tr>
   <td>Role Entity
   </td>
   <td>Each user of this application has a role. They may be a student, a leader (of a club), or an administrator. The attributes are: id (int), name (str), users (List[UserEntity]), permissions (List[PermissionEntity]0
   </td>
   <td>id, name, users, permissions
   </td>
  </tr>
  <tr>
   <td>User Entity
   </td>
   <td>Each user of this application has information that needs to be stored so that they can access different parts of the site. When signing in, one needs to fill out a ‘Profile’ form with the following information: First Name (str), Last Name (str), UNC email (str), and Pronouns (str). Then, each user has specific roles (List[RoleEntity]), permissions they are allowed (List[PermissionEntity]), clubs they are a part of (List[ClubEntity]), and clubs they are a leader of (List[ClubEntity]).
   </td>
   <td>id, pid, onyen, email, first_name, last_name, pronouns, roles, permissions, clubs, leading_clubs
   </td>
  </tr>
    <td>Category Entity
   </td>
   <td> Upon creation, each club has the option to be associated with certain tags or attributes. This makes the club able to be searched by a student when they search through clubs by filtering through them. The possible categories to choose from are: Black/African American, Asian American/Pacific Islander, Volunteer, Women, Hispanic/Latinx, LGBTQIA+, Video Games, Hackathon, Non-Binary, Volunteer, iOS Development, Business, and Project Management. The Category Entity has a list of clubs and Potential Clubs that have a specific Category ID. This information is stored in two different secondary tables, one for potential clubs and one for real clubs.
   </td>
   <td>id: Mapped[int] , name: Mapped[str], clubs: Mapped[list[ClubEntity]], potential_clubs: Mapped[list[PotentialClubEntity]]
   </td>
  </tr>
  <tr>
  <td>WeekDayTime Entity
   </td>
   <td> A WeekDayTime Entity is keeps track of the weekday (Monday, Tuesday, etc) and the time (4:00PM, 9:30 AM, ect) that a club meets. This entity was created because a standard datetime object wasn't applicable. The start and end times of an event are converted to strings in the from model method to work around issues with backend and front end time objects. Each WeekDayTime entity is associated with one singular Potential Club Entity or Club Entity.
   </td>
   <td>id: Mapped[int], day: Mapped[str], start_time: Mapped[time], end_time: Mapped[time]
   </td>
  </tr>
  <tr>
</table>

We chose to add a “Change Role” button on the side navigation bar instead of allowing users to have only 1 role, because many students may want to be both a member of one club, and a leader of another. Thus they would have both the roles “Student” and “Leader”. Additionally, if a student were to be given the role of an administrator, they should be allowed to switch between their other roles too. If I am a student only, I cannot change my role. But if I am a student and a leader, I can choose to switch between my roles and experience the application in different ways. Our application was designed this way as we all thought it made more sense to have permissions inherently built into our models. This means that if you are a leader of a club, you can only see leader things for your specific club. There is also an "Administrator" view that is only viewable for administrators. Only Arden Administrator has the ability to add and delete other administrators.


# Development Concerns


For beginners to Angular applications, it is best to start by following an official [Angular Tutorial](https://angular.io/tutorial). This will walk one through the setup process, how to generate new components and services, how to use routing to navigate the application, and how to set up the frontend HTML to put everything together smoothly. 

For beginners to databases, it is equally beneficial to follow an online tutorial such as the [SQLAlchemy Unified Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/index.html). While it is fairly long, it is worth the time to fully understand how the backend pieces are functioning.

In order to expand upon this feature, it is vital to understand how both the frontend and the backend work, as well as how they are connected. To do so, it is helpful to look at some of the following files:
* The /backend/entities folder contains all of the entities that are used in our application (see above for a detailed description of each). Each entity is connected to a model in /backend/models. 
* The /backend/services folder contains all of the services needed for our FastAPI routes, which are declared in /backend/api. 
* In /frontend/src/app, it is important to make sure that when a component is added, the proper routing is also added, as this is not automatic. Look in /frontend/src/app/app-routing.module.ts to see examples of how this is done.

**In order to get started, it is important to read through /docs/getting-started.md to get a full understanding of how to reset the database, start the development container, and authorize users.**


# Future Work

In the future, we would love to see this application fully developed with abilities for the user to have a more personalized experience. Some examples might include:
* On the page where all events are listed, the events could be filtered so that the first ones that show up are the ones hosted by a student’s clubs.  They likely have more interest in attending these events. 
* On the page where all clubs are listed, it would be beneficial to add a search bar so that a user can easily find a club if they have one in mind already. 
