import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchResults } from './dto/search-response.dto';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Search courses, lessons and currencies',
    description:
      'Public endpoint. Returns up to five matches per category. No authentication required.',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    example: 'bitcoin',
    description: 'Free-text query (1-100 characters)',
  })
  search(@Query() query: SearchQueryDto): Promise<SearchResults> {
    return this.searchService.search(query.q);
  }
}
