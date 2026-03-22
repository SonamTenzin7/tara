import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Settlement } from "../entities/settlement.entity";
import { Bet } from "../entities/bet.entity";
import { User } from "../entities/user.entity";
import { AdminController } from "./admin.controller";
import { MarketsModule } from "../markets/markets.module";

@Module({
  imports: [TypeOrmModule.forFeature([Settlement, Bet, User]), MarketsModule],
  controllers: [AdminController],
})
export class AdminModule {}
