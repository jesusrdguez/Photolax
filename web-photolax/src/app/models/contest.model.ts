import { User } from './user.model';

export interface Contest {
    contest_id?: number;
    title: string;
    start_date: Date;
    end_date: Date;
    max_participants: number;
    user?: User;
    photo_ids?: number[];
}

export interface ContestCreate {
    title: string;
    start_date: Date;
    end_date: Date;
    max_participants: number;
} 