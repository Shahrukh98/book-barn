import * as moment from 'moment';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book, BorrowRequest, BorrowRequestStatus } from './book.entity';
import { CreateBook, CreateBorrowRequest, UpdateBook } from './book.interface';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    
    @InjectRepository(BorrowRequest)
    private borrowRepository: Repository<BorrowRequest>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
  ): Promise<{ books: Book[]; page: number; pageSize: number }> {
    const books = await this.bookRepository.find({
      order: { [sortBy]: sortDirection.localeCompare('asc') ? 'DESC' : 'ASC' },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    return {
      books: books,
      page: page,
      pageSize: pageSize,
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException('Invalid Book ID!');
    }

    return book;
  }

  async create(book: CreateBook): Promise<string> {
    const newBook: Book = await this.bookRepository.save(book);
    return newBook?.id;
  }

  async update(id: string, bookUpdate: UpdateBook): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException('Invalid Book ID!');
    }

    book.title = bookUpdate?.title ?? book.title
    book.photoUrl = bookUpdate?.photoUrl ?? book.photoUrl
    book.author = bookUpdate?.author ?? book.author
    book.publishedDate = bookUpdate?.publishedDate ?? book.publishedDate
    book.isbn = bookUpdate?.isbn ?? book.isbn
    book.summary = bookUpdate?.summary ?? book.summary
    
    await this.bookRepository.update(id, book);
    return;
  }

  async delete(id: string): Promise<string> {
    const book = await this.bookRepository.findOne({ where: { id: id } });
    if (!book) {
      throw new NotFoundException('Invalid Book ID!');
    }

    const pendingRequests = await this.borrowRepository.find({
      where: { status: BorrowRequestStatus.Pending, book: { id: id } },
    });

    if (pendingRequests.length) {
      throw new BadRequestException("Can't delete book. Has pending requests!");
    }

    const approvedRequestWithoutReturn = await this.borrowRepository.findOne({
      where: {
        book: { id: id },
        status: BorrowRequestStatus.Approved,
        returned: false,
      },
    });

    if (approvedRequestWithoutReturn) {
      throw new BadRequestException("Can't delete book. Book is borrowed!");
    }

    await this.bookRepository.delete(id);
    return 'Book Deleted!';
  }

  async makeBorrowRequest(
    bookId: string,
    userId: string,
    numberOfDays: number,
  ): Promise<string> {
    try {
      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException();
      }

      const borrowRequest: BorrowRequest | null =
        await this.borrowRepository.findOne({
          where: {
            user: { id: userId },
            book: { id: bookId },
            status: BorrowRequestStatus.Pending,
          },
        });

      if (borrowRequest) {
        throw new BadRequestException(
          'You already have a pending request for this book!',
        );
      }

      const newRequest = await this.borrowRepository.save({
        book: bookId,
        user: userId,
        numberOfDays: numberOfDays,
      } as CreateBorrowRequest);
      return newRequest?.id;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async returnBook(bookId: string, userId: string): Promise<string> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Invalid Book ID!');
    }

    const borrowRequest: BorrowRequest | null =
      await this.borrowRepository.findOne({
        where: {
          user: { id: userId },
          book: { id: bookId },
          status: BorrowRequestStatus.Approved,
          returned: false,
        },
      });

    if (!borrowRequest) {
      throw new BadRequestException('No Borrow Request!');
    }
    await this.borrowRepository.update(borrowRequest.id, { returned: true });
    return 'Book Returned!';
  }

  async approveBorrowRequest(requestId: string): Promise<BorrowRequest> {
    const borrowRequest: BorrowRequest | null =
      await this.borrowRepository.findOne({
        where: { id: requestId },
        relations: { book: true },
      });

    if (!borrowRequest) {
      throw new NotFoundException('Invalid Borrow Request ID!');
    }

    if (borrowRequest && borrowRequest.status != 'pending') {
      throw new ConflictException('Borrow Request is already processed!');
    }

    const bookId: string = borrowRequest.book.id;
    const previousApprovedRequest: BorrowRequest | null =
      await this.borrowRepository.findOne({
        where: {
          status: BorrowRequestStatus.Approved,
          book: { id: bookId },
          returned: false,
        },
      });

    if (previousApprovedRequest) {
      throw new BadRequestException(
        'Book is already borrowed. Cannot approve until the book is returned!',
      );
    }

    const currentTime: moment.Moment = moment();
    const dueDate = currentTime
      .add(borrowRequest.numberOfDays as moment.DurationInputArg1, 'days')
      .toISOString();
    borrowRequest.dueDate = dueDate.split('T')[0];
    borrowRequest.status = BorrowRequestStatus.Approved;
    borrowRequest.returned = false;

    await this.borrowRepository.update(requestId, borrowRequest);
    return borrowRequest;
  }

  async rejectBorrowRequest(requestId: string): Promise<BorrowRequest> {
    const borrowRequest: BorrowRequest | null =
      await this.borrowRepository.findOne({ where: { id: requestId } });

    if (!borrowRequest) {
      throw new NotFoundException('Invalid Borrow Request ID!');
    }

    if (borrowRequest && borrowRequest.status != 'pending') {
      throw new ConflictException('Borrow Request is already processed!');
    }
    borrowRequest.status = BorrowRequestStatus.Rejected;
    await this.borrowRepository.update(requestId, borrowRequest);

    return borrowRequest;
  }
}
