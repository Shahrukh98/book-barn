import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Users } from '../users/users.entity';
import { CreateBook, CreateBorrowRequest } from './book.interface';


@Entity()
export class Book implements CreateBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({ type: 'varchar', length: 1000 })
  photoUrl: string;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Column({ type: 'date' })
  publishedDate: string;

  @Column({ type: 'varchar', length: 100 })
  isbn: string;

  @Column({ type: 'text' })
  summary: string;

  @OneToMany(() => BorrowRequest, (borrowRequest) => borrowRequest.book, {
    onDelete: 'CASCADE',
  })
  borrowRequests?: BorrowRequest[];
}

export enum BorrowRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Entity()
export class BorrowRequest implements CreateBorrowRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 10 })
  numberOfDays: number;

  @Column({
    type: 'enum',
    enum: BorrowRequestStatus,
    default: BorrowRequestStatus.Pending,
  })
  status: BorrowRequestStatus;

  @Column({ type: 'date', default: null })
  dueDate: string;

  @Column({ type: 'boolean', default: null })
  returned: boolean;

  @ManyToOne(() => Book, (book) => book.borrowRequests, { onDelete: 'CASCADE' })
  book: Book;

  @ManyToOne(() => Users, (user) => user.borrowRequests, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
