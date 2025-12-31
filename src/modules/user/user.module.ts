import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { MapperModule } from 'src/common/mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MapperModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
