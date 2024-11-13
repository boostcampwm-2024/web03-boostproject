import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { AccountRepository } from 'src/account/account.repository';
import { AuthController } from './auth.controller';
@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
		  global: true,
		  secret: jwtConstants.secret,
		  signOptions: { expiresIn: '6000s' },
		}),
	],
	providers: [UserRepository, AccountRepository, AuthService, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
