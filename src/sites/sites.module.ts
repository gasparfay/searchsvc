import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesService } from './sites.service.js';
import { SitesController } from './sites.controller.js';
import { Site, SiteSchema } from './schemas/site.schema.js';
import { AccountsModule } from '../accounts/accounts.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    AccountsModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
  exports: [SitesService, MongooseModule],
})
export class SitesModule {}

