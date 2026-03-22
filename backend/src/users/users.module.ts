import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Transaction } from "../entities/transaction.entity";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  controllers: [UsersController],
})
export class UsersModule {}
