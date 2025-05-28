import { User } from './user.model';
import { Contest } from './contest.model';

export enum PhotoStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface Photo {
    photo_id?: number;
    title: string;
    upload_date?: Date;
    status: PhotoStatus;
    file_data?: string;
    user?: User;
    contest?: Contest;
    voteCount?: number;
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