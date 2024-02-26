export type Notification = {
  id?: number;
  content: string;
  redirect: string;
  related_user_id: number;
  created_at?: Date;
};

export type Filters = {
  interests: string[];
  minAge: number;
  maxAge: number;
  minFameRating: number;
  maxFameRating: number;
}

export type Gender = 'female' | 'male' | 'other';
export type SexualPreferences = 'female' | 'male' | 'other';

export type CompleteForm = {
  gender: Gender;
  sexualPreferences: SexualPreferences;
  age: number;
  interests: string[];
  pictures: string;
  biography: string;
};
