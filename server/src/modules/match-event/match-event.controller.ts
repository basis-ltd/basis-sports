import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/auth/decorators/require-permissions.decorator';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { FindMatchEventsQueryDto } from './dto/find-match-events-query.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';
import { MatchEventService } from './match-event.service';

@ApiTags('match-events')
@Controller('match-events')
export class MatchEventController {
  constructor(private readonly matchEventService: MatchEventService) {}

  @Get()
  @RequirePermissions('match-events:read')
  @ApiOperation({ summary: 'List match events' })
  findAll(@Query() query: FindMatchEventsQueryDto) {
    return this.matchEventService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('match-events:read')
  @ApiOperation({ summary: 'Get match event by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchEventService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('match-events:manage')
  @ApiOperation({ summary: 'Create match event' })
  create(@Body() dto: CreateMatchEventDto) {
    return this.matchEventService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('match-events:manage')
  @ApiOperation({ summary: 'Update match event' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMatchEventDto,
  ) {
    return this.matchEventService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('match-events:manage')
  @ApiOperation({ summary: 'Delete match event' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.matchEventService.remove(id);
    return { deleted: true };
  }
}