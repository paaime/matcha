export type ThrownError = {
	code: string;
	message: string;
}

export type JwtDatas = {
  id: number;
  email: string;
}

export type Notification = {
  content: string;
  redirect: string;
  related_user_id: number;
}
