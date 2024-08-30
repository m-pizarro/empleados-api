import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EmpleadosController } from './empleados.controller'
import { EmpleadosService } from './empleados.service'
import { IEmpleadosService } from './interfaces/empleados.service.interface'
import { Empleado as EmpleadoDocument, EmpleadoSchema } from './models/empleado.model'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmpleadoDocument.name, schema: EmpleadoSchema }]),
    HttpModule,
  ],
  controllers: [EmpleadosController],
  providers: [
    {
      provide: IEmpleadosService,
      useClass: EmpleadosService,
    },
  ],
})
export class EmpleadosModule {}
