import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './books/book.controller';
import { BookService } from './books/book.service';
import { BooksModule } from './books/book.module';
import { MorganMiddleware } from './middlewares/morgan.middleware';
import { Book } from './books/book.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5455,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Book],
      synchronize: true,
    }),
    BooksModule
  ],
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MorganMiddleware).forRoutes(BookController)
  }
}