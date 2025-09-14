import { ApiProperty, PartialType } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsPhoneNumber, 
  IsBoolean,
  IsEnum,
  MaxLength,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserSettings } from '../../entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class NotificationSettingsDto {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  sms?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  whatsapp?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  inApp?: boolean;
}

export class UpdateUserSettingsDto {
  @ApiProperty({ type: NotificationSettingsDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notifications?: NotificationSettingsDto;

  @ApiProperty({ example: 'America/New_York', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'light', enum: ['light', 'dark'], required: false })
  @IsOptional()
  @IsEnum(['light', 'dark'])
  theme?: 'light' | 'dark';
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  settings: UserSettings;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserListResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}