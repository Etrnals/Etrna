import { IsEthereumAddress, IsHexadecimal, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateUefDto {
  @IsEthereumAddress()
  owner: string;

  @IsUrl()
  uri: string;

  @IsHexadecimal()
  @IsString()
  @Length(66, 66)
  contentHash: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
