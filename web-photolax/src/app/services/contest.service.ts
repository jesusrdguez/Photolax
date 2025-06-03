import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contest, ContestCreate } from '../models/contest.model';
import { environment } from '../../environments/environment';
import { tap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContestService {
    constructor(private http: HttpClient) { }

    getContests(): Observable<Contest[]> {
        return this.http.get<Contest[]>(`${environment.apiUrl}/contests`).pipe(
            map(contests => contests.map(contest => ({
                ...contest,
                contest_id: contest.id
            })))
        );
    }

    getContestById(id: number): Observable<Contest> {
        return this.http.get<Contest>(`${environment.apiUrl}/contests/${id}`).pipe(
            map(contest => ({
                ...contest,
                contest_id: contest.id
            }))
        );
    }

    getContestByTitle(title: string): Observable<Contest> {
        console.log('Fetching contest with title:', title);
        return this.http.get<Contest>(`${environment.apiUrl}/contests/title/${title}`).pipe(
            tap(response => console.log('Contest API response:', response)),
            map(contest => ({
                ...contest,
                contest_id: contest.id
            }))
        );
    }

    createContest(contest: ContestCreate): Observable<Contest> {
        return this.http.post<Contest>(`${environment.apiUrl}/contests`, contest).pipe(
            map(contest => ({
                ...contest,
                contest_id: contest.id
            }))
        );
    }

    updateContest(id: number, contest: ContestCreate): Observable<Contest> {
        return this.http.put<Contest>(`${environment.apiUrl}/contests/${id}`, contest).pipe(
            map(contest => ({
                ...contest,
                contest_id: contest.id
            }))
        );
    }

    deleteContest(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/contests/${id}`);
    }
} 