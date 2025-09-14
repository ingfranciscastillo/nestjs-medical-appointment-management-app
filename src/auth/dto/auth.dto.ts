import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsPhoneNumber,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Full name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email address' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!', 
    description: 'Password (min 8 chars, must contain uppercase, lowercase, number and special char)' 
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
    }
  )
  password: string;

  @ApiProperty({ 
    example: '+1234567890', 
    description: 'Phone number',
    required: false 
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.PATIENT,
    description: 'User role',
    required: false 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Password' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
  };
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refresh_token: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'juan@example.com', description: 'Email address' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received by email' })
  @IsString()
  token: string;

  @ApiProperty({ 
    example: 'NewSecurePass123!', 
    description: 'New password' 
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
    }
  )
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ 
    example: 'NewSecurePass123!', 
    description: 'New password' 
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character',
    }
  )
  newPassword: string;
}