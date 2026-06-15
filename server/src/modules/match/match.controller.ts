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
import { CreateMatchDto } from './dto/create-match.dto';
import { FindMatchesQueryDto } from './dto/find-matches-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchService } from './match.service';

@ApiTags('matches')
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @RequirePermissions('matches:read')
  @ApiOperation({ summary: 'List matches' })
  findAll(@Query() query: FindMatchesQueryDto) {
    return this.matchService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('matches:read')
  @ApiOperation({ summary: 'Get match by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('matches:manage')
  @ApiOperation({ summary: 'Create match' })
  create(@Body() dto: CreateMatchDto) {
    return this.matchService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('matches:manage')
  @ApiOperation({ summary: 'Update match' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.matchService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('matches:manage')
  @ApiOperation({ summary: 'Delete match' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.matchService.remove(id);
    return { deleted: true };
  }
}