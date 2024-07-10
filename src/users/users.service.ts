import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './users.entity';
import { CreateUser } from './users.interface';

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

  create(user: CreateUser) {
    return this.userRepository.save(user);
  }
}
