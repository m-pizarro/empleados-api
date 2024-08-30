import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import configuration from '../core/config/configuration'
import { UsuariosModule } from '../usuarios/usuarios.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { IAuthService } from './interfaces/auth.service.interface'
import { JwtStrategy } from './middlewares/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    UsuariosModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigType<typeof configuration>) => ({
        secret: cfg.jwt.accessSecret,
        signOptions: {
          expiresIn: cfg.jwt.accessExpiration,
        },
      }),
      inject: [configuration.KEY],
    }),
  ],

  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
