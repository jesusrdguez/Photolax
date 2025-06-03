import { User } from './user.model';
import { Contest } from './contest.model';

export enum PhotoStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface Photo {
    id: number;
    title: string;
    status: PhotoStatus;
    photoBase64?: string;
    username: string;
    voteCount: number;
}

export interface PhotoUploadRequest {
    title: string;
    file: File;
    contest_id: number;
}

export interface PhotoCard {
    photo_id: number;
    title: string;
    imageUrl: string;
    voteCount: number;
    userFullName: string;
} 