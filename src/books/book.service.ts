import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import {
  CreateBookDto,
  UpdateBookDto,
} from './book.interface';


@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  findAll(page: number, limit: number, sortBy: string, order: string): Promise<Book[]> {
    var offset = limit * (page - 1)
    return this.bookRepository.find({
      order: { [sortBy]: order.localeCompare('asc') ? "ASC" : "DESC" },
      skip: offset,
      take: limit
    });
  }

  findOne(id: string): Promise<Book| null> {
    return this.bookRepository.findOne({ where: { id: id } });
  }

  create(book: CreateBookDto): Promise<any> {
    return this.bookRepository.save(book)
    
  }

  update(id: string, book: UpdateBookDto): Promise<any> {
    return this.bookRepository.update(id, book);
  }

  delete(id: string): Promise<any> {
    return this.bookRepository.delete(id);
  }
}
