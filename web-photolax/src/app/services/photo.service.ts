import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo, PhotoCard, PhotoUploadRequest } from '../models/photo.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    constructor(private http: HttpClient) { }

    uploadPhoto(data: PhotoUploadRequest): Observable<Photo> {
        const formData = new FormData();
        const photoDetails = {
            title: data.title,
            contestId: data.contest_id
        };
        formData.append('photoDetails', new Blob([JSON.stringify(photoDetails)], { type: 'application/json' }));
        formData.append('file', data.file);

        return this.http.post<Photo>(`${environment.apiUrl}/photos`, formData);
    }

    getPhotos(contestId?: number): Observable<PhotoCard[]> {
        const url = contestId 
            ? `${environment.apiUrl}/photos?contest_id=${contestId}`
            : `${environment.apiUrl}/photos`;
        return this.http.get<PhotoCard[]>(url);
    }

    getPhotoById(id: number): Observable<Photo> {
        return this.http.get<Photo>(`${environment.apiUrl}/photos/${id}`);
    }

    updatePhotoStatus(id: number, status: string): Observable<Photo> {
        return this.http.put<Photo>(`${environment.apiUrl}/photos/${id}/status`, { status });
    }

    deletePhoto(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/photos/${id}`);
    }

    getUserPhotos(): Observable<PhotoCard[]> {
        return this.http.get<PhotoCard[]>(`${environment.apiUrl}/photos/user`);
    }

    getAllPhotosAdmin(): Observable<Photo[]> {
        return this.http.get<Photo[]>(`${environment.apiUrl}/photos`);
    }
} 