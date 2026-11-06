import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({
    description:
      'Free-text query matched against titles, descriptions, names and symbols',
    example: 'bitcoin',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  q: string;
}
