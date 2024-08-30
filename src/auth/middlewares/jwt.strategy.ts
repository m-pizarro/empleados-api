import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IUsuariosService } from '../../usuarios/interfaces/usuario.service.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(IUsuariosService) private usersService: IUsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username)
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
