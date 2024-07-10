import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { UserRole } from '../auth/auth.guard';
import { BorrowRequest } from '../books/book.entity';
import { CreateUser } from './users.interface';

@Entity()
export class Users implements CreateUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => BorrowRequest, (borrowRequest) => borrowRequest.book)
  borrowRequests?: BorrowRequest[];
}
