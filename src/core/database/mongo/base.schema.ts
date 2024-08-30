import { Schema } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema()
export class BaseDocument {
  _id: Types.ObjectId
}
