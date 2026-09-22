import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema.js';
import { CreateSiteDto } from './dto/create-site.dto.js';
import { UpdateSiteDto } from './dto/update-site.dto.js';
import { AccountsService } from '../accounts/accounts.service.js';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name)
    private readonly siteModel: Model<SiteDocument>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<SiteDocument> {
    // Validar que la cuenta titular exista en la base de datos
    await this.accountsService.findOne(createSiteDto.accountId);

    const createdSite = new this.siteModel({
      name: createSiteDto.name,
      url: createSiteDto.url,
      maxDepth: createSiteDto.maxDepth,
      frequency: createSiteDto.frequency,
      extractorSnippet: createSiteDto.extractorSnippet,
      pageResolverSnippet: createSiteDto.pageResolverSnippet,
      accountId: new Types.ObjectId(createSiteDto.accountId),
    });
    return createdSite.save();
  }

  async findAll(accountId?: string): Promise<SiteDocument[]> {
    const filter = accountId ? { accountId: new Types.ObjectId(accountId) } : {};
    return this.siteModel.find(filter).populate('accountId', 'name email apiKey').exec();
  }

  async findOne(id: string): Promise<SiteDocument> {
    const site = await this.siteModel.findById(id).populate('accountId', 'name email apiKey').exec();
    if (!site) {
      throw new NotFoundException(`Site with ID "${id}" not found`);
    }
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<SiteDocument> {
    const updated = await this.siteModel.findByIdAndUpdate(id, updateSiteDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Site with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.siteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Site with ID "${id}" not found`);
    }
    return { deleted: true };
  }
}

