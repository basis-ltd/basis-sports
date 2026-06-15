import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/auth/decorators/require-permissions.decorator';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @RequirePermissions('roles:manage')
  @ApiOperation({ summary: 'List roles' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @RequirePermissions('roles:manage')
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findByIdOrFail(id);
  }

  @Post(':id/permissions')
  @RequirePermissions('roles:manage')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  async assignPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    await this.roleService.assignPermissions(id, dto.permissionIds);
    return this.roleService.findById(id);
  }

  @Delete(':id/permissions')
  @RequirePermissions('roles:manage')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  async removePermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    await this.roleService.removePermissions(id, dto.permissionIds);
    return this.roleService.findById(id);
  }
}