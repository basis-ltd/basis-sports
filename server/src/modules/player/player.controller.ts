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
import { CreatePlayerDto } from './dto/create-player.dto';
import { FindPlayersQueryDto } from './dto/find-players-query.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerService } from './player.service';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  @RequirePermissions('players:read')
  @ApiOperation({ summary: 'Search and list players' })
  findAll(@Query() query: FindPlayersQueryDto) {
    return this.playerService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('players:read')
  @ApiOperation({ summary: 'Get player by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.playerService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('players:manage')
  @ApiOperation({ summary: 'Create player' })
  create(@Body() dto: CreatePlayerDto) {
    return this.playerService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('players:manage')
  @ApiOperation({ summary: 'Update player' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlayerDto,
  ) {
    return this.playerService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('players:manage')
  @ApiOperation({ summary: 'Delete player' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.playerService.remove(id);
    return { deleted: true };
  }
}