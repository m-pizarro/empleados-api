import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string

  @IsString()
  @IsNotEmpty()
  apellido: string

  @IsString()
  @IsNotEmpty()
  puesto: string

  @IsNotEmpty()
  fechaNacimiento: Date
}
