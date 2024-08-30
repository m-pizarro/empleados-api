import { Types } from 'mongoose'

export interface IEmpleado {
  _id: Types.ObjectId
  nombre: string
  apellido: string
  puesto: string
  fechaNacimiento: Date
}
