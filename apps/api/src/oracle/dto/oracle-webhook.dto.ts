import { IsHexadecimal, IsInt, IsPositive, Length } from 'class-validator';

export class OracleWebhookDto {
  @IsInt()
  @IsPositive()
  chainRequestId: number;

  @IsHexadecimal()
  @Length(66, 66)
  resultHash: string;
}
