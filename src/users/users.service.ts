import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { User, UserSettings } from '../entities/user.entity';
import { UpdateUserDto, UpdateUserSettingsDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'phone', 'isActive', 'createdAt'],
      ...options,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'phone', 'isActive', 'settings', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Remove password from response
    delete updatedUser.password;
    return updatedUser;
  }

  async updateSettings(id: string, settings: UpdateUserSettingsDto): Promise<User> {
    const user = await this.findOne(id);

    user.settings = {
      ...user.settings,
      ...settings,
    };

    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    await this.userRepository.update(id, {
      isActive: false,
    });
  }

  async activate(id: string): Promise<void> {
    const user = await this.findOne(id);
    
    await this.userRepository.update(id, {
      isActive: true,
    });
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getUserStats(userId: string): Promise<any> {
    // TODO: Implement user statistics
    // This could include appointment count, etc.
    return {
      totalAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      upcomingAppointments: 0,
    };
  }
}