import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MapperModule } from 'src/common/mapper/mapper.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'DMFmgkfgj#I$#Ifjdfkdk',
      signOptions: { expiresIn: '60m' }
    }),
    MapperModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule { }
