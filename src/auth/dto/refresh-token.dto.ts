import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  sub: string

  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
