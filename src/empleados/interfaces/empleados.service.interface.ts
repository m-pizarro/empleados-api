import { EmpleadosFilter } from '../dto/empleados-filter.dto'
import { IEmpleado } from './empleado.interface'

export interface IEmpleadosService {
  create(employeeDto: Partial<IEmpleado>): Promise<IEmpleado>
  findAll(filters: EmpleadosFilter): Promise<IEmpleado[]>
  findWithFilters(filters: EmpleadosFilter): Promise<IEmpleado[]>
  findOne(id: string): Promise<IEmpleado>
  update(id: string, employeeDto: Partial<IEmpleado>): Promise<IEmpleado>
  delete(id: string): Promise<IEmpleado>
  getPuestosEmpleados(): Promise<string[]>
}

export const IEmpleadosService = Symbol('IEmpleadosService')
