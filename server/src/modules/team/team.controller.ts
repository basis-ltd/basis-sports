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
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @RequirePermissions('teams:read')
  @ApiOperation({ summary: 'List teams' })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @RequirePermissions('teams:read')
  @ApiOperation({ summary: 'Get team by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('teams:manage')
  @ApiOperation({ summary: 'Create team' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('teams:manage')
  @ApiOperation({ summary: 'Update team' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('teams:manage')
  @ApiOperation({ summary: 'Delete team' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.teamService.remove(id);
    return { deleted: true };
  }
}