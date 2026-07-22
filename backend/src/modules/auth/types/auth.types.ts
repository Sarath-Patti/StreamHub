export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayloadDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface RegisterInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginInputDTO {
  email: string;
  password: string;
}
