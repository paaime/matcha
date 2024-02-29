import { Notification } from './type';

export interface IUser {
  id: number;
  username: string;
  isOnline: boolean;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  sexualPreferences: string;
  distance?: number; // Can be undefined
  loc?: string; // Can be undefined
  city?: string; // Can be undefined
  consentLocation: boolean;
  biography?: string; // Can be undefined
  interests: string[];
  pictures?: string; // Can be undefined
  fameRating: number;
  isMatch: boolean;
  isLiked: boolean;
  isSuperLike?: boolean;
  isLikeTime?: string; // Can be undefined
  hasLiked: boolean;
  hasSuperLike?: boolean;
  hasLikeTime?: string; // Can be undefined
  isBlocked: boolean;
  hasBlocked: boolean;
  matchId?: string; // If isMatch = true ; can be undefined
  matchTime?: string; // If isMatch = true ; can be undefined
  lastConnection: string;
  isVerified: boolean;
  created_at: string;
}

export interface ILove {
  id: number;
  username: string;
  isOnline: boolean;
  firstName: string;
  age: number;
  gender: string;
  distance?: number; // Can be undefined
  city?: string; // Can be undefined
  pictures?: string; // Can be undefined
  compatibilityScore: number;
  isMatch?: boolean;
  isSuperLike?: boolean;
  fameRating?: number; // Can be undefined
}

export interface IDiscovery {
  id: number;
  username: string;
  isOnline: boolean;
  firstName: string;
  age: number;
  distance?: number; // Can be undefined
  city?: string; // Can be undefined
  pictures?: string; // Can be undefined
}

export interface IMapUser {
  id: number;
  username: string;
  isOnline: boolean;
  firstName: string;
  pictures: string;
  loc: string[];
}

export interface IUserList {
  id: number;
  username: string;
  firstName: string;
  age: number
  pictures: string;
  created_at: string;
}

export interface IUserSettings {
  id: number;
  username: string;
  isVerified: boolean;
  isOnline: boolean; // Must be 'true'
  isComplete: boolean;
  lastConnection: string;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  sexualPreferences: string;
  loc: string;
  city: string; // Can be undefined
  consentLocation: boolean;
  biography: string;
  interests: string[];
  pictures: string;
  fameRating: number;
  visitHistory: IUserList[];
  userVisited: IUserList[]; // Il manque la date du coup
  usersBlocked: IUserList[];
  notifications: Notification[];
}
