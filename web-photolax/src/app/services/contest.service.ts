import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contest, ContestCreate } from '../models/contest.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContestService {
    constructor(private http: HttpClient) { }

    getContests(): Observable<Contest[]> {
        return this.http.get<Contest[]>(`${environment.apiUrl}/contests`);
    }

    getContestById(id: number): Observable<Contest> {
        return this.http.get<Contest>(`${environment.apiUrl}/contests/${id}`);
    }

    createContest(contest: ContestCreate): Observable<Contest> {
        return this.http.post<Contest>(`${environment.apiUrl}/contests`, contest);
    }

    updateContest(id: number, contest: ContestCreate): Observable<Contest> {
        return this.http.put<Contest>(`${environment.apiUrl}/contests/${id}`, contest);
    }

    deleteContest(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/contests/${id}`);
    }
} 