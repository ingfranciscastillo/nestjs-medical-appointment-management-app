import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponseDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset email sent (if user exists)',
  })
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password reset successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
    return { message: 'Password has been reset successfully.' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully.' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user (invalidate tokens)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Logged out successfully',
  })
  async logout(@Request() req: any): Promise<{ message: string }> {
    // TODO: Implement token blacklisting in Redis
    // For now, just return success message
    return { message: 'Logged out successfully.' };
  }

  @Post('verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify if current token is valid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid',
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async verifyToken(@Request() req: any): Promise<{ valid: boolean; user: any }> {
    return {
      valid: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
}