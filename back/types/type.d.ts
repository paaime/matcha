export type ThrownError = {
  code: string;
  message: string;
};

export type JwtDatas = {
  id: number;
  email: string;
};

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