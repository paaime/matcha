export type Notification = {
  id?: number;
  isRead?: boolean;
  content: string;
  redirect?: string;
  related_user_id?: number;
  created_at: string;
};

export type Filters = {
  interests: string[];
  minAge: number;
  maxAge: number;
  minFameRating: number;
  maxFameRating: number;
  maxDistance: number;
};

export type Gender = 'female' | 'male' | 'other';
export type SexualPreferences = 'female' | 'male' | 'other';

export type CompleteForm = {
  username: string;
  gender: Gender;
  sexualPreferences: SexualPreferences;
  age: number;
  interests: string[];
  pictures: string;
  biography: string;
};
