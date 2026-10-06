import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  // Relación One-to-Many / hasMany: Cada sitio pertenece a una Cuenta (Account)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  })
  accountId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ default: 2 })
  maxDepth: number;

  @Prop({ default: 'daily' })
  frequency: string;

  @Prop({ required: true })
  extractorSnippet: string;

  @Prop({ required: false })
  pageResolverSnippet?: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
