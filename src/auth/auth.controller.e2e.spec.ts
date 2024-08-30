import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../app.module'
import { AuthUserDto } from './dto/auth-user.dto'
import { IAuthToken } from './interfaces/auth.interface'

function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(2, 15)
  const domain = 'test.com'
  return `${randomString}@${domain}`
}

describe('AuthController (e2e)', () => {
  let app: INestApplication
  let vaidTokens: IAuthToken

  const testUser: AuthUserDto = {
    email: generateRandomEmail(),
    password: 'testpassword',
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const res = await request(app.getHttpServer()).post('/auth/register').send(testUser)
    vaidTokens = res.body as IAuthToken
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/auth/register (POST)', () => {
    it('debe registrar un nuevo usuario', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: generateRandomEmail(),
          password: 'testpassword',
        })
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).toHaveProperty('access_token')
      expect(response.body).toHaveProperty('refresh_token')
    })

    it('debe retornar400 si falta el email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          password: 'testpassword',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('message', 'Email y contraseña son requeridos.')
        })
    })

    it('debe retornar 400 si falta el password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('message', 'Email y contraseña son requeridos.')
        })
    })
  })

  describe('/auth/login (POST)', () => {
    it('Debe iniciar sesión de un usuario con credenciales válidas', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token')
          expect(res.body).toHaveProperty('refresh_token')
        })
    })

    it('debe retornar 401 si la contraseña es incorrecta', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser',
          password: 'incorrectpassword',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('message', 'Email o contraseña incorrectos.')
        })
    })

    it('debe retornar 400 si falta el email', async () => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          password: 'testpassword',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('message')
        })
    })

    it('debe retornar 400 si falta la contraseña', async () => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser',
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('message')
        })
    })
  })

  describe('/auth/refresh (POST)', () => {
    it('debe hacer un refresh access and refresh tokens', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${vaidTokens.access_token}`)
        .send({
          sub: testUser.email,
          refreshToken: vaidTokens.refresh_token,
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token')
          expect(res.body).toHaveProperty('refresh_token')
        })
    })

    it('debe retornar 403 si falta el refreshToken', () => {
      return request(app.getHttpServer()).post('/auth/refresh').expect(403)
    })
  })

  describe('/auth/logout (POST)', () => {
    it('debe hacer un log out del usurio', async () => {
      return await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${vaidTokens.access_token}`)
        .send({
          sub: testUser.email,
        })
        .expect(204)
    })

    it('debe retornar 401 si el token no se envía', () => {
      return request(app.getHttpServer()).post('/auth/logout').expect(401)
    })
  })
})
