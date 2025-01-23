import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            cors: true,
        },
    );

    // Swagger setup
    const document = new DocumentBuilder()
        .setTitle('API Overview')
        .addBearerAuth()
        .build();

    SwaggerModule.setup('swagger', app, () =>
        SwaggerModule.createDocument(app, document),
    );

    // Validation
    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT || 8080;

    await app.listen({
        port: port,
        host: '0.0.0.0',
    });

    Logger.log(`APP START LISTENING ON PORT: ${port}`);
}

bootstrap();
