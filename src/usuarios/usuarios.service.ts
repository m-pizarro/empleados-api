import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUsuarioDto } from './dto/create-usuario.dto'
import { IUsuario } from './interfaces/usuario.interface'
import { IUsuariosService } from './interfaces/usuario.service.interface'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@Injectable()
export class UsuariosService implements IUsuariosService {
  constructor(@InjectModel('Usuario') private usuarioModel: Model<IUsuario>) {}

  async findOne(email: string): Promise<IUsuario> {
    return await this.usuarioModel.findOne({ email })
  }

  async create(dto: CreateUsuarioDto): Promise<IUsuario> {
    const usuario = new this.usuarioModel(dto)
    return await usuario.save()
  }

  async update(id: string, dto: RefreshTokenDto): Promise<IUsuario> {
    return await this.usuarioModel.findByIdAndUpdate(id, dto, { new: true }).exec()
  }
}
