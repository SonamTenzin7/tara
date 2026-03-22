import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bet } from "../entities/bet.entity";
import { BetsController } from "./bets.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Bet])],
  controllers: [BetsController],
})
export class BetsModule {}
