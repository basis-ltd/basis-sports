import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/auth/decorators/require-permissions.decorator';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentService } from './tournament.service';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @RequirePermissions('tournaments:read')
  @ApiOperation({ summary: 'List tournaments' })
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  @RequirePermissions('tournaments:read')
  @ApiOperation({ summary: 'Get tournament by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tournamentService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('tournaments:manage')
  @ApiOperation({ summary: 'Create tournament' })
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('tournaments:manage')
  @ApiOperation({ summary: 'Update tournament' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTournamentDto,
  ) {
    return this.tournamentService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('tournaments:manage')
  @ApiOperation({ summary: 'Delete tournament' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tournamentService.remove(id);
    return { deleted: true };
  }
}