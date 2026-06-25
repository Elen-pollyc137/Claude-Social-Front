export type PerfilUsuario = "ADMINISTRADOR" | "COORDENADOR" | "TECNICO" | "CONSULTA";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: string;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  usuario: Usuario;
};

export type MeResponse = {
  usuario: Usuario & {
    criadoEm: string;
    atualizadoEm: string;
  };
};
