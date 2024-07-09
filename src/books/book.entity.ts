import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/users.entity';

export interface CreateBookDto {
  title: string;
  photoUrl: string;
  author: string;
  publishedDate: string;
  isbn: string;
  summary: string;
}

export interface UpdateBookDto {
  title?: string;
  photoUrl?: string;
  author?: string;
  publishedDate?: string;
  isbn?: string;
  summary?: string;
}

@Entity()
export class Book implements CreateBookDto {
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
export interface CreateBorrowRequestDto {
  book: Book;
  user: Users;
  numberOfDays: number;
}

@Entity()
export class BorrowRequest implements CreateBorrowRequestDto {
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
