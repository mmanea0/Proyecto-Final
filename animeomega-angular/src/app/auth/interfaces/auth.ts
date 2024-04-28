export interface LoginRequest {
  nickname: string;
  password: string;
}

export interface LoginResponse {
  id: number;

  access_token: string;
  roles: [string];

  nickname: string;
  activo: number;
  bloqueado: number;
}
