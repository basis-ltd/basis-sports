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
import { CreatePlayerMatchStatDto } from './dto/create-player-match-stat.dto';
import { FindPlayerMatchStatsQueryDto } from './dto/find-player-match-stats-query.dto';
import { UpdatePlayerMatchStatDto } from './dto/update-player-match-stat.dto';
import { PlayerMatchStatService } from './player-match-stat.service';

@ApiTags('player-match-stats')
@Controller('player-match-stats')
export class PlayerMatchStatController {
  constructor(
    private readonly playerMatchStatService: PlayerMatchStatService,
  ) {}

  @Get()
  @RequirePermissions('player-match-stats:read')
  @ApiOperation({ summary: 'List player match statistics' })
  findAll(@Query() query: FindPlayerMatchStatsQueryDto) {
    return this.playerMatchStatService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('player-match-stats:read')
  @ApiOperation({ summary: 'Get player match stat by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerMatchStatService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('player-match-stats:manage')
  @ApiOperation({ summary: 'Create player match stat' })
  create(@Body() dto: CreatePlayerMatchStatDto) {
    return this.playerMatchStatService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('player-match-stats:manage')
  @ApiOperation({ summary: 'Update player match stat' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlayerMatchStatDto,
  ) {
    return this.playerMatchStatService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('player-match-stats:manage')
  @ApiOperation({ summary: 'Delete player match stat' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerMatchStatService.remove(id);
    return { deleted: true };
  }
}