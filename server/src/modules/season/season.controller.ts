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
import { CreateSeasonDto } from './dto/create-season.dto';
import { FindSeasonsQueryDto } from './dto/find-seasons-query.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonService } from './season.service';

@ApiTags('seasons')
@Controller('seasons')
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get()
  @RequirePermissions('seasons:read')
  @ApiOperation({ summary: 'List seasons' })
  findAll(@Query() query: FindSeasonsQueryDto) {
    return this.seasonService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('seasons:read')
  @ApiOperation({ summary: 'Get season by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.seasonService.findByIdOrFail(id);
  }

  @Post()
  @RequirePermissions('seasons:manage')
  @ApiOperation({ summary: 'Create season' })
  create(@Body() dto: CreateSeasonDto) {
    return this.seasonService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('seasons:manage')
  @ApiOperation({ summary: 'Update season' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSeasonDto,
  ) {
    return this.seasonService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('seasons:manage')
  @ApiOperation({ summary: 'Delete season' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.seasonService.remove(id);
    return { deleted: true };
  }
}