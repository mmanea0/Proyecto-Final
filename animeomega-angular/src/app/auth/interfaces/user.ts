export interface User {
  name: string;
  email: string;
  discord_id: string;
  nickname: string;
  avatar: string;
  access_token: string;

  //roles
  roles: [string];
}