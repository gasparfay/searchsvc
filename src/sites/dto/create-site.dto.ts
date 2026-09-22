import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateSiteDto {
  @IsMongoId()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxDepth?: number = 2;

  @IsString()
  @IsOptional()
  frequency?: string = 'daily';

  @IsString()
  @IsNotEmpty()
  extractorSnippet: string;

  @IsString()
  @IsOptional()
  pageResolverSnippet?: string;
}

