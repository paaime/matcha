import { Notification } from './type';

export interface IPage {
  id: number;
  visited_user_id: IUser;
  redirectUri: string;
  created_at: string;
}

export interface IUser {
  id: number;
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
}

export interface IDiscovery {
  id: number;
  isOnline: boolean;
  firstName: string;
  age: number;
  distance?: number; // Can be undefined
  city?: string; // Can be undefined
  pictures?: string; // Can be undefined
}

export interface IMapUser {
  id: number;
  isConnected: boolean;
  isOnline: boolean;
  firstName: string;
  pictures: string;
  loc: string[];
}

export interface IUserSettings {
  id: number;
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
  visitHistory: IPage[];
  userVisited: IUser[]; // Il manque la date du coup
  usersBlocked: IUser[];
  notifications: Notification[];
}
