import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, phone, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || UserRole.PATIENT,
      settings: {
        notifications: {
          email: true,
          sms: true,
          whatsapp: true,
          inApp: true,
        },
        timezone: 'America/New_York',
        language: 'en',
        theme: 'light',
      },
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = this.generateTokens(savedUser);

    // Update last login
    await this.userRepository.update(savedUser.id, {
      lastLoginAt: new Date(),
    });

    return {
      ...tokens,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phone: savedUser.phone,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether user exists or not
      return;
    }

    // TODO: Generate reset token and send email
    // This would typically involve:
    // 1. Generate a secure random token
    // 2. Store it with expiration in database or Redis
    // 3. Send email with reset link
    console.log(`Password reset requested for ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: Implement password reset logic
    // This would typically involve:
    // 1. Verify the reset token
    // 2. Find the associated user
    // 3. Update the password
    // 4. Invalidate the token
    throw new BadRequestException('Password reset functionality not implemented yet');
  }

  private generateTokens(user: User) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    const accessToken = this.jwtService.sign(payload);
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}