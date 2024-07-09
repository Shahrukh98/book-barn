import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, Users } from '../users/users.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      token: await this.jwtService.signAsync(payload),
      expiry: jwtConstants.expiresIn,
    };
  }

  async register(
    user: CreateUserDto,
  ): Promise<{ token: string; expiry: string }> {
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
      expiry: jwtConstants.expiresIn,
    };
  }
}
