import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './book.entity';
import { IsInt, IsOptional, IsEnum, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthortizedRequest, RolesGuard, UserRole } from '../auth/auth.guard';

export class GetBooksQueryDto {
  @IsOptional()
  @IsInt()
  @Min(10)
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsEnum(['id', 'title', 'author', 'publishedDate'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortDirection?: string;
}

class CreateBookBody implements CreateBookDto {
  @IsString()
  title: string;
  @IsString()
  photoUrl: string;
  @IsString()
  author: string;
  @IsString()
  publishedDate: string;
  @IsString()
  isbn: string;
  @IsString()
  summary: string;
}

class BorrowRequestBody {
  @IsInt()
  @Min(5)
  numberOfDays: number;
}

// GET /books user, admin
// GET /books/[id] user, admin
// POST /books admin
// PUT /books/[id]  admin
// DELETE /books/[id]  admin

// POST /books/borrow/[id] user
// POST /books/return/[id] user
// POST /books/approve/[requestId] admin
// POST /books/reject/[id] admin

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() book: CreateBookBody) {
    return await this.bookService.create(book);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User, UserRole.Admin])
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryParams: GetBooksQueryDto) {
    const page = queryParams?.page ?? 1;
    const pageSize = queryParams?.pageSize ?? 10;
    const sortBy = queryParams?.sortBy ?? 'id';
    const sortDirection = queryParams?.sortDirection ?? 'asc';
    return this.bookService.findAll(page, pageSize, sortBy, sortDirection);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User, UserRole.Admin])
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.bookService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.bookService.delete(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User])
  @Post('/borrow/:id')
  @HttpCode(HttpStatus.OK)
  async makeBorrowRequest(
    @Param('id') id: string,
    @Req() request: AuthortizedRequest,
    @Body() body: BorrowRequestBody,
  ) {
    return await this.bookService.makeBorrowRequest(
      id,
      request.user.id,
      body.numberOfDays,
    );
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User])
  @Post('/return/:id')
  @HttpCode(HttpStatus.OK)
  async returnBook(
    @Param('id') id: string,
    @Req() request: AuthortizedRequest,
  ) {
    return await this.bookService.returnBook(id, request.user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/approve/:requestId')
  @HttpCode(HttpStatus.OK)
  async approveBorrowRequest(@Param('requestId') requestId: string) {
    return await this.bookService.approveBorrowRequest(requestId);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/reject/:requestId')
  @HttpCode(HttpStatus.OK)
  async rejectBorrowRequest(@Param('requestId') requestId: string) {
    return await this.bookService.rejectBorrowRequest(requestId);
  }
}
