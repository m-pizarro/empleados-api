import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseDocument } from '../../core/database/mongo/base.schema'
import { IEmpleado } from '../interfaces/empleado.interface'

@Schema()
export class Empleado extends BaseDocument implements IEmpleado {
  @Prop({ required: true })
  nombre: string

  @Prop({ required: true })
  apellido: string

  @Prop({ required: true })
  puesto: string

  @Prop({ required: true })
  fechaNacimiento: Date
}

export const EmpleadoSchema = SchemaFactory.createForClass<IEmpleado>(Empleado)
