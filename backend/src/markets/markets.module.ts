import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Market } from "../entities/market.entity";
import { Outcome } from "../entities/outcome.entity";
import { Bet } from "../entities/bet.entity";
import { Transaction } from "../entities/transaction.entity";
import { Settlement } from "../entities/settlement.entity";
import { User } from "../entities/user.entity";
import { MarketsService } from "./markets.service";
import { MarketsController } from "./markets.controller";
import { ParimutuelEngine } from "./parimutuel.engine";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Market,
      Outcome,
      Bet,
      Transaction,
      Settlement,
      User,
    ]),
  ],
  providers: [MarketsService, ParimutuelEngine],
  controllers: [MarketsController],
  exports: [MarketsService, ParimutuelEngine],
})
export class MarketsModule {}
