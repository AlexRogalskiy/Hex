
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async login(username: string, password: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { username: username }
    });
    return compare(password, user.password) ? user : undefined;
  }

  async create(username: string, password: string): Promise<User> {
    const user = this.usersRepository.create({
      username: username,
      password: await this.hashPassword(password)
    });
    return this.usersRepository.save(user)
  }
}