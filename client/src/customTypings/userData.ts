export type UserDataType = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  refreshToken: string;
  roleList: string[];
  challengeStreak: number;
  profilePicture: number;
};
