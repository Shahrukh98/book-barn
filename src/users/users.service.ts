import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username: username } });
  }

  create(user: CreateUserDto) {
    return this.userRepository.save(user);
  }
}
