import { IsEthereumAddress, IsInt, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateOracleRequestDto {
  @IsInt()
  @IsPositive()
  uefId: number;

  @IsString()
  @MaxLength(280)
  prompt: string;

  @IsEthereumAddress()
  requesterAddress: string;
}
