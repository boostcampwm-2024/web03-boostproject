import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});

	// const config = new DocumentBuilder()
    // 	.setTitle('CorinEE API example')
    // 	.setDescription('CorinEE API description')
    // 	.setVersion('1.0')
    // 	.addTag('corinee')
    // 	.build();
  	// const documentFactory = () => SwaggerModule.createDocument(app, config);
  	// SwaggerModule.setup('api', app, documentFactory);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
