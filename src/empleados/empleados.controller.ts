import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CreateEmpleadoDto } from './dto/create-empleado.dto'
import { EmpleadosFilter } from './dto/empleados-filter.dto'
import { UpdateEmpleadoDto } from './dto/update-empleado.dto'
import { IEmpleado } from './interfaces/empleado.interface'
import { IEmpleadosService } from './interfaces/empleados.service.interface'

@Controller('empleados')
export class EmpleadosController {
  constructor(@Inject(IEmpleadosService) private readonly empleadosService: IEmpleadosService) {}

  @Get('/puestos')
  @HttpCode(200)
  async puestos(): Promise<string[]> {
    return await this.empleadosService.getPuestosEmpleados()
  }

  @Get()
  @HttpCode(200)
  async findAll(@Query() filters: EmpleadosFilter): Promise<IEmpleado[]> {
    return await this.empleadosService.findWithFilters(filters)
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<IEmpleado> {
    return await this.empleadosService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto): Promise<IEmpleado> {
    return await this.empleadosService.create(createEmpleadoDto)
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<IEmpleado> {
    return await this.empleadosService.update(id, updateEmpleadoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<IEmpleado> {
    return await this.empleadosService.delete(id)
  }
}
