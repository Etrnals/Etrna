import { IsHexadecimal, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUefDto {
  @IsOptional()
  @IsUrl()
  uri?: string;

  @IsOptional()
  @IsHexadecimal()
  @IsString()
  @Length(66, 66)
  contentHash?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
