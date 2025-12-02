import { IsBoolean, IsString, IsUrl } from 'class-validator';

export class UploadTrackDto {
  @IsString()
  title: string;

  @IsString()
  @IsUrl({ require_tld: false })
  uri: string;

  @IsBoolean()
  mintOnChain: boolean;
}
