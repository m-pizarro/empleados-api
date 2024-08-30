import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common'
import { Public } from '../core/decorators/public.decorator'
import { AuthUserDto } from './dto/auth-user.dto'
import { LogoutDto } from './dto/logout.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { IAuthService } from './interfaces/auth.service.interface'
import { IAuthToken } from './interfaces/auth.interface'

@Controller('auth')
export class AuthController {
  constructor(@Inject(IAuthService) private readonly authService: IAuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  async register(@Body() body: AuthUserDto): Promise<IAuthToken> {
    const { email, password } = body
    return await this.authService.signUp(email, password)
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: AuthUserDto): Promise<IAuthToken> {
    const { email, password } = body
    return this.authService.signIn(email, password)
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Body() body: LogoutDto): Promise<void> {
    const { sub } = body
    await this.authService.logout(sub)
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  refreshTokens(@Body() body: RefreshTokenDto): Promise<IAuthToken> {
    const { sub, refreshToken } = body
    return this.authService.refreshTokens(sub, refreshToken)
  }
}
