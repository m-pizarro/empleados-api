import { HttpService } from '@nestjs/axios'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AxiosResponse } from 'axios'
import { Model } from 'mongoose'
import { lastValueFrom } from 'rxjs'
import { CreateEmpleadoDto } from './dto/create-empleado.dto'
import { IEmpleado } from './interfaces/empleado.interface'
import { IEmpleadosService } from './interfaces/empleados.service.interface'
import { ConfigType } from '@nestjs/config'
import configuration from '../core/config/configuration'
import { EmpleadosFilter } from './dto/empleados-filter.dto'

@Injectable()
export class EmpleadosService implements IEmpleadosService {
  private readonly logger = new Logger(EmpleadosService.name)

  constructor(
    @InjectModel('Empleado') private readonly empleadModel: Model<IEmpleado>,
    @Inject(configuration.KEY) private readonly config: ConfigType<typeof configuration>,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateEmpleadoDto): Promise<IEmpleado> {
    const employee = new this.empleadModel(dto)
    return employee.save()
  }

  async findAll(): Promise<IEmpleado[]> {
    return this.empleadModel.find().exec()
  }

  async findWithFilters(filters: EmpleadosFilter): Promise<IEmpleado[]> {
    const query: any = {}

    if (filters.nombre) {
      query.nombre = new RegExp(filters.nombre, 'i')
    }

    return this.empleadModel.find(query).exec()
  }

  async findOne(id: string): Promise<IEmpleado> {
    return this.empleadModel.findById(id).exec()
  }

  async update(id: string, employeeDto: Partial<IEmpleado>): Promise<IEmpleado> {
    const empleado = await this.findOne(id)
    if (!empleado) {
      throw new Error('El empleado no existe')
    }
    return this.empleadModel.findByIdAndUpdate(id, employeeDto, { new: true }).exec()
  }

  async delete(id: string): Promise<IEmpleado> {
    const empleado = await this.empleadModel.findByIdAndDelete(id).exec()
    if (!empleado) {
      throw new Error('El empleado no existe')
    }
    return empleado
  }

  async getPuestosEmpleados(): Promise<string[]> {
    try {
      const response: AxiosResponse<{ positions: string[] }> = await lastValueFrom(
        this.httpService.get(this.config.puestosApiUrl),
      )
      return response.data.positions
    } catch (e) {
      this.logger.error(e)
    }
  }
}
