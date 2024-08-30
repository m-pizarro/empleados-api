import { BadRequestException, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import configuration from '../core/config/configuration'
import { IUsuario } from '../usuarios/interfaces/usuario.interface'
import { IUsuariosService } from '../usuarios/interfaces/usuario.service.interface'
import { IAuthToken } from './interfaces/auth.interface'
import { IAuthService } from './interfaces/auth.service.interface'

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(IUsuariosService) private readonly usersService: IUsuariosService,
    @Inject(configuration.KEY) private readonly config: ConfigType<typeof configuration>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUsuario> {
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos.')
    }

    const user = await this.usersService.findOne(email)
    if (!user) {
      throw new BadRequestException('Email o contraseña incorrectos.')
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Las contraseñas no coinciden.')
    }

    return user
  }

  async signUp(email: string, password: string): Promise<IAuthToken> {
    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos.')
    }
    const existingUser = await this.usersService.findOne(email)
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.usersService.create({ email, password: hashedPassword })

    const tokens = await this.getTokens(newUser._id, newUser.email)
    await this.updateRefreshToken(newUser._id, tokens.refresh_token)

    return tokens
  }

  async signIn(email: string, password: string): Promise<IAuthToken> {
    const user = await this.validateUser(email, password)
    const tokens = await this.getTokens(user._id, user.email)
    await this.updateRefreshToken(user._id, tokens.refresh_token)
    return tokens
  }

  async logout(email: string): Promise<void> {
    const user = await this.usersService.findOne(email)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')
    await this.usersService.update(user._id, { refreshToken: null })
  }

  async refreshTokens(email: string, refreshToken: string): Promise<IAuthToken> {
    const user = await this.usersService.findOne(email)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const refreshTokenMatches: boolean = bcrypt.compareSync(refreshToken, user.refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user._id, user.email)
    await this.updateRefreshToken(user._id, tokens.refresh_token)

    return tokens
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  private async getTokens(userId: string, username: string): Promise<IAuthToken> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.config.jwt.accessSecret,
          expiresIn: this.config.jwt.accessExpiration,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.config.jwt.refreshSecret,
          expiresIn: this.config.jwt.refreshExpiration,
        },
      ),
    ])

    return {
      access_token,
      refresh_token,
    }
  }
}
