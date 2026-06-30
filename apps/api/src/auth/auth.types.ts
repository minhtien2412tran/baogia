export interface AuthUser {
  userId: number;
  email: string;
  role: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  type?: string;
}
