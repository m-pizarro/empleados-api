import { ConfigType, registerAs } from '@nestjs/config'

const configuration = registerAs('global', () => {
  // The host and port the application will run on
  const serverProtocol: string = process.env.SERVER_API_PROTOCOL || 'http'
  const serverHost: string = process.env.SERVER_API_HOST || 'localhost'
  const serverPort: number = parseInt(process.env.SERVER_API_PORT || '') || 3000

  const puestosApiUrl: string =
    process.env.PUESTOS_API_URL || 'https://ibillboard.com/api/positions'

  // The environment the application is running in
  const environment: string = process.env.NODE_ENV || 'development'

  // MongoDB
  const mongoUrl: string = process.env.MONGO_URL || 'mongodb://localhost:27017'
  const mongoDb: string = process.env.MONGO_DB || 'empleados'

  return {
    serverProtocol,
    serverHost,
    serverPort,
    puestosApiUrl,
    environment,
    mongoDb: {
      url: mongoUrl,
      db: mongoDb,
    },
    jwt: {
      accessSecret: process.env.JWT_SECRET,
      accessExpiration: process.env.TOKEN_EXPIRES_IN || '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiration: process.env.REFRESH_TOKEN_EXPIRES_IN || '1d',
    },
  }
})

export type AppConfigType = ConfigType<typeof configuration>
export default configuration
