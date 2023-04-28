import { Pipe, PipeTransform } from '@angular/core';
import { Observable, ObservableNotification } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Club, User_Club } from './clubs.service';
import { User } from './admin.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(user_clubs$: Observable<User_Club[]>, searchText: string): Observable<User_Club[]> {
        if(!searchText) return user_clubs$;
        searchText = searchText.toLowerCase();
        var searchedResult$: Observable<User_Club[]>
        searchedResult$ = user_clubs$.pipe(map((user_clubs: User_Club[]) => {
            return user_clubs.filter(a_user_club => a_user_club.club.name == searchText)
        }))
        return searchedResult$
    }
}
