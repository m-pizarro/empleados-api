import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  email

  @IsString()
  @IsNotEmpty()
  password
}
