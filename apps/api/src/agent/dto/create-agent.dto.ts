import { IsString, IsUrl } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  onchainAddress: string;

  @IsUrl()
  manifestUri: string;
}
