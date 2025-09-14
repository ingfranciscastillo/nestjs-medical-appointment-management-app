import { 
  Controller, 
  Get, 
  Put, 
  Patch,
  Delete,
  Param, 
  Body, 
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';
import { 
  UpdateUserDto, 
  UpdateUserSettingsDto,
  UserResponseDto,
  UserListResponseDto,
} from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all users (Admin/Receptionist only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [UserListResponseDto],
  })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async findAll(@Query('role') role?: UserRole): Promise<UserListResponseDto[]> {
    const options = role ? { where: { role } } : {};
    return this.usersService.findAll(options);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'User statistics retrieved successfully',
  })
  async getUserStats(@CurrentUser('id') userId: string): Promise<any> {
    return this.usersService.getUserStats(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get user by ID (Admin/Receptionist only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({ 
    status: 200, 
    description: 'Settings updated successfully',
    type: UserResponseDto,
  })
  async updateSettings(
    @CurrentUser('id') userId: string,
    @Body() settings: UpdateUserSettingsDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateSettings(userId, settings);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.usersService.deactivate(id);
    return { message: 'User deactivated successfully' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.usersService.activate(id);
    return { message: 'User activated successfully' };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}