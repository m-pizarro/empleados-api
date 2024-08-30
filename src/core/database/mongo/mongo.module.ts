import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import configuration from '../../config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigType<typeof configuration>) => {
        const mongoUri = `${cfg.mongoDb.url}/${cfg.mongoDb.db}`
        return {
          uri: mongoUri,
          connectionFactory: connection => {
            if (connection.readyState === 1) {
              console.log(`Connected to database ${mongoUri}`)
            }
            return connection
          },
        }
      },
      inject: [configuration.KEY],
    }),
    MongoModule,
  ],
})
export class MongoModule {}
