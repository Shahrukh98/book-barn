import * as bcrypt from 'bcrypt';
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Users } from '../users/users.entity';
import { CreateUser } from '../users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ token: string; expiry: string }> {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isEmail: boolean = regex.test(username);
    let user = null;

    if (isEmail) {
      user = await this.usersService.findByEmail(username);
    } else {
      user = await this.usersService.findByUsername(username);
    }

    if (!user) {
      throw new BadRequestException('No user found!');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials!');
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      token: await this.jwtService.signAsync(payload),
      expiry: this.configService.get<string>("JWT_EXPIRY_DURATION") as string,
    };
  }

  async register(
    user: CreateUser,
  ): Promise<{ token: string; expiry: string }> {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      const createdUser: Users = await this.usersService.create(user);

      const payload = {
        id: createdUser.id,
        username: user.username,
        role: createdUser.role,
      };
      return {
        token: await this.jwtService.signAsync(payload),
        expiry: this.configService.get<string>("JWT_EXPIRY_DURATION") as string,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
