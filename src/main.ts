import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            cors: true
        }
    );

    // Swagger setup
    const document = new DocumentBuilder()
        .setTitle('API Overview')
        .addBearerAuth()
        .build();

    SwaggerModule.setup('swagger', app, () => SwaggerModule.createDocument(app, document));

    // Validation
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}

bootstrap();
