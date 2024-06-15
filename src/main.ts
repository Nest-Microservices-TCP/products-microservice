import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main');

  /**
   * 1.- Ahora en lugar de usar solo NestFactory.create, usamos
   * NestFactory.createMicroservice
   * 2.- Recibira 2 parametros, el AppModule y las configuraciones
   * del microservicios, las cuales son el metodos de
   * transporte/comunicacion y el puerto en el que estara escuchando
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * 3.- app.listen() ya no necesita recibir el puerto ya que este
   * se configuro en la config del microservicio
   */
  await app.listen();
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
