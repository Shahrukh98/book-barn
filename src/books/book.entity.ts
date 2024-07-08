import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateBookDto } from './book.interface';

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
  
  @Column({ type: 'text'})
  summary: string;
}