import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

export class Account {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: () => randomUUID(), unique: true, index: true })
  apiKey: string;

  @Prop({ required: false, trim: true, sparse: true })
  auth0Id?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Relación One-to-Many / hasMany: Una Cuenta tiene muchos Sitios (Sites)
AccountSchema.virtual('sites', {
  ref: 'Site',
  localField: '_id',
  foreignField: 'accountId',
});


