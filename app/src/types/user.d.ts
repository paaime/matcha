export interface ITag {
  id: number;
	name: string;
}

export interface IUser {
  id: number;
	firstName: string;
  lastName: string;
  age: number;
  gender: string;
  sexualPreferences: string;
  distance?: number;
  biography?: string;
	interests: ITag[];
	pictures?: string;
  fameRating: number;
	isMatch: boolean;
	isLiked: boolean;
	hasLiked: boolean;
	isBlocked: boolean;
	hasBlocked: boolean;
	matchId?: string; // If isMatch = true
}