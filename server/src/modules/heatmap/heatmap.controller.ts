import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/auth/decorators/require-permissions.decorator';
import { GetHeatmapQueryDto } from './dto/get-heatmap-query.dto';
import { HeatmapService } from './heatmap.service';

@ApiTags('heatmap')
@Controller('heatmap')
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Get()
  @RequirePermissions('heatmap:read')
  @ApiOperation({ summary: 'Generate zone heatmap for a player' })
  generate(@Query() query: GetHeatmapQueryDto) {
    return this.heatmapService.generate(query);
  }
}