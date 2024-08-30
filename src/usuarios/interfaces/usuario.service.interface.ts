import { CreateUsuarioDto } from '../dto/create-usuario.dto'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { IUsuario } from './usuario.interface'

export interface IUsuariosService {
  findOne(username: string): Promise<IUsuario>
  create(user: CreateUsuarioDto): Promise<IUsuario>
  update(id: string, dto: RefreshTokenDto): Promise<IUsuario>
}

export const IUsuariosService = Symbol('IUsuariosService')
