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
	distance?: number; // Can be undefined
	city?: string; // Can be undefined
  biography?: string; // Can be undefined
	interests: ITag[];
	pictures?: string; // Can be undefined
  fameRating: number;
	isMatch: boolean;
	isLiked: boolean;
	hasLiked: boolean;
	isBlocked: boolean;
	hasBlocked: boolean;
	matchId?: string; // If isMatch = true ; can be undefined
}
