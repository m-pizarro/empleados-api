import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import configuration from './core/config/configuration'
import { ConfigType } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigType<typeof configuration>>(configuration.KEY)
  const logger = new Logger('Bootstrap')

  app.enableCors()

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(config.serverPort)
  logger.log(
    `Application is running on ${config.serverProtocol}://${config.serverHost}:${config.serverPort}`,
  )
}
bootstrap()
