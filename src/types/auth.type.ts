export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  access_token: string;
};
