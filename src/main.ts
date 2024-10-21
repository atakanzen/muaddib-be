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

    // Register plugins
    await app.register(compression, { encodings: ['gzip', 'deflate', 'br'] });

    // Validation
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}

bootstrap();
