import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import compression from '@fastify/compress';


async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            cors: true
        }
    );

    app.register(compression, { encodings: ['gzip', 'deflate', 'br'] });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
