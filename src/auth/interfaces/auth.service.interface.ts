import { IUsuario } from '../../usuarios/interfaces/usuario.interface'
import { IAuthToken } from './auth.interface'

export interface IAuthService {
  validateUser(email: string, password: string): Promise<IUsuario>
  signUp(email: string, password: string): Promise<IAuthToken>
  signIn(email: string, password: string)
  logout(email: string): Promise<void>
  refreshTokens(email: string, refreshToken: string)
}

export const IAuthService = Symbol('IAuthService')
