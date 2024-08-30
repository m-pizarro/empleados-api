import { IsOptional, IsString } from 'class-validator'

export class EmpleadosFilter {
  @IsOptional()
  @IsString()
  nombre?: string
}
