import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime()
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    let responseBody = ''
    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')
      const diff = process.hrtime(startAt)
      const responseTime = `${diff[0]}s ${Math.round(diff[1] / 1e6)}ms`

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} [${responseTime}] ${contentLength} - ${userAgent} ${ip}`,
      )
      // if debug
      this.logger.debug('body', request.body)
      this.logger.debug('Response', responseBody || '<empty>')
    })

    // if debug
    const send = response.send
    response.send = exitData => {
      responseBody = exitData
      response.send = send
      return response.send(exitData)
    }

    next()
  }
}
