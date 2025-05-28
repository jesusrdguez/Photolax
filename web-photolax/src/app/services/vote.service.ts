import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vote } from '../models/vote.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VoteService {
    constructor(private http: HttpClient) { }

    voteForPhoto(photoId: number): Observable<Vote> {
        return this.http.post<Vote>(`${environment.apiUrl}/votes`, { photo_id: photoId });
    }

    getUserVotes(): Observable<Vote[]> {
        return this.http.get<Vote[]>(`${environment.apiUrl}/votes/user`);
    }

    hasUserVotedForPhoto(photoId: number): Observable<boolean> {
        return this.http.get<boolean>(`${environment.apiUrl}/votes/check/${photoId}`);
    }

    removeVote(photoId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/votes/${photoId}`);
    }
} 