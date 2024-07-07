import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main');

  console.log(envs.natsServers);

  /**
   * 1.- Ahora en lugar de usar solo NestFactory.create, usamos
   * NestFactory.createMicroservice
   * 2.- Recibirá 2 parámetros, el AppModule y las configuraciones
   * del microservicios, las cuales son el métodos de
   * transporte/comunicación y el puerto en el que estará escuchando
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    /**
     * Ahora, en lugar de usar comunicación TCP con el microservicio, sera
     * usado un broker, en este caso NATS, el cual permite una comunicación
     * mas sencillas entre nuestro microservicios, esta es la forma en la
     * que cambiamos la comunicación de TCP a NATS
     */
    // {
    //   transport: Transport.TCP,
    //   options: {
    //     port: envs.port,
    //   },
    // },
    //TODO: Convertir esto en un snippet
    {
      transport: Transport.NATS,
      options: {
        /**
         * Dado que agregamos nuestro array de servidores a las variables de
         * entorno, entonces podemos asignar directamente esa variable a la
         * propiedad servers de nuestra configuración de NATS
         */
        // servers: ['nats://localhost:4222'],
        servers: envs.natsServers,
      },
    },
  );

  //TODO: Convertir esto en un snippet
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
