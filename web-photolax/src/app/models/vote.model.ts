import { User } from './user.model';
import { Photo } from './photo.model';

export interface Vote {
    id?: number;
    user: User;
    photo: Photo;
    voteDate?: Date;
} 