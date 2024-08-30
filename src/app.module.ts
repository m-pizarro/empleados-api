import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import configuration from './core/config/configuration'
import { MongoModule } from './core/database/mongo/mongo.module'
import { LoggerMiddleware } from './core/middlewares/loggerMiddleware'
import { EmpleadosModule } from './empleados/empleados.module'
import { UsuariosModule } from './usuarios/usuarios.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongoModule,
    AuthModule,
    EmpleadosModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
