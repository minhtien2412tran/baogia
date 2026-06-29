import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('J - TA API')
    .setDescription('Clean-room Private Jet Booking Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Expose OpenAPI JSON at /openapi.json using underlying Express instance
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/openapi.json', (req, res) => {
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
