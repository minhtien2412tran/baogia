import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('J - TA API')
    .setDescription('Clean-room Private Jet Booking Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/openapi.json', (_req: unknown, res: { setHeader: (k: string, v: string) => void; send: (d: unknown) => void }) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/swagger`);
  console.log(`OpenAPI JSON is available at: http://localhost:${port}/openapi.json`);
}
bootstrap();
