import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'

export const validationPipe = () =>
  new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(validationErrors)
    },
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: {
      target: false,
    },
  })
