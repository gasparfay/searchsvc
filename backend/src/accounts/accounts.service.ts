import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<AccountDocument> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }

  async findAll(): Promise<AccountDocument[]> {
    return this.accountModel.find().populate('sites').exec();
  }

  async findOne(id: string): Promise<AccountDocument> {
    const account = await this.accountModel.findById(id).populate('sites').exec();
    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return account;
  }

  async findByApiKey(apiKey: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ apiKey }).exec();
  }

  async findByEmail(email: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ email }).exec();
  }

  async update(id: string, updateAccountDto: UpdateAccountDto,): Promise<AccountDocument> {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(id, updateAccountDto, { new: true }).exec();
    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return updatedAccount;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.accountModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }
    return { deleted: true };
  }
}
