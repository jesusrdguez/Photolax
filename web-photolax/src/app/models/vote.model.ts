import { User } from './user.model';
import { Photo } from './photo.model';

export interface Vote {
    id?: number;
    photoId: number;
    username: string;
    voteDate?: string;
} 