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
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'List users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id/roles')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Get roles assigned to a user' })
  getRoles(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getRoles(id);
  }

  @Get(':id')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findByIdOrFail(id);
  }

  @Post(':id/roles')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Assign roles to a user' })
  async assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    await this.userService.findByIdOrFail(id);
    await this.userService.assignRoles(id, dto.roleIds);
    return this.userService.getRoles(id);
  }

  @Delete(':id/roles')
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'Remove roles from a user' })
  async removeRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    await this.userService.findByIdOrFail(id);
    await this.userService.removeRoles(id, dto.roleIds);
    return this.userService.getRoles(id);
  }
}