import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../app.module'
import { AuthModule } from '../auth/auth.module'
import { CreateEmpleadoDto } from './dto/create-empleado.dto'
import { EmpleadosModule } from './empleados.module'

describe('EmpleadosController (e2e)', () => {
  let app
  let token
  let testEmpleadoId

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, AuthModule, EmpleadosModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'admin@admin.com',
      password: 'admin',
    })

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin@admin.com',
      password: 'admin',
    })
    token = res.body.access_token

    const response = await request(app.getHttpServer())
      .post('/empleados')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'testEmpleado',
        apellido: 'testApellido',
        fechaNacimiento: new Date(),
        puesto: 'testPuesto',
      })
    testEmpleadoId = response.body._id
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/empleados', () => {
    it('GET /empleados should return all empleados', async () => {
      return await request(app.getHttpServer())
        .get('/empleados')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toBeDefined()
          expect(response.body.length).toBeGreaterThan(0)
        })
    })

    it('POST /empleados should create a new empleado', async () => {
      const createEmpleadoDto: CreateEmpleadoDto = {
        nombre: 'Nuevo Empleado',
        apellido: 'Apellido',
        fechaNacimiento: new Date(),
        puesto: 'Puesto',
      }
      return await request(app.getHttpServer())
        .post('/empleados')
        .set('Authorization', `Bearer ${token}`)
        .send(createEmpleadoDto)
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toBeDefined()
          expect(response.body._id).toBeDefined()
          expect(response.body.nombre).toBe(createEmpleadoDto.nombre)
        })
    })

    it('GET /empleados/:id should return the specified empleado', async () => {
      const response = await request(app.getHttpServer())
        .get(`/empleados/${testEmpleadoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toBeDefined()
      expect(response.body._id).toBe(testEmpleadoId)
    })

    it('PUT /empleados/:id should update the specified empleado', async () => {
      const updatedEmpleado = {
        nombre: 'Nombre Editado',
      }

      return await request(app.getHttpServer())
        .patch(`/empleados/${testEmpleadoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedEmpleado)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toBeDefined()
          expect(response.body._id).toBe(testEmpleadoId)
          expect(response.body.nombre).toBe('Nombre Editado')
        })
    })

    it('DELETE /empleados/:id should delete the specified empleado', async () => {
      return await request(app.getHttpServer())
        .delete(`/empleados/${testEmpleadoId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
    })
  })
})
