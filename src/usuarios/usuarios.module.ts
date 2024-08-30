import { Module } from '@nestjs/common'
import { IUsuariosService } from './interfaces/usuario.service.interface'
import { UsuariosService } from './usuarios.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Usuario as UsuarioDocument, UsuarioSchema } from './models/usuario.model'

@Module({
  imports: [MongooseModule.forFeature([{ name: UsuarioDocument.name, schema: UsuarioSchema }])],
  providers: [
    {
      provide: IUsuariosService,
      useClass: UsuariosService,
    },
  ],
  exports: [
    {
      provide: IUsuariosService,
      useClass: UsuariosService,
    },
  ],
})
export class UsuariosModule {}
