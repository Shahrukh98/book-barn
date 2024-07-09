import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, BorrowRequest } from './book.entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BorrowRequest])],
  exports: [TypeOrmModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BooksModule {}
