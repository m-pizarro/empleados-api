import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Usuario extends Document {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  refreshToken: string
}

export const UsuarioSchema = SchemaFactory.createForClass<Usuario>(Usuario)
