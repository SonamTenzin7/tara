import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Market, MarketStatus } from "../entities/market.entity";
import { Outcome } from "../entities/outcome.entity";
import { ParimutuelEngine } from "./parimutuel.engine";

export class CreateMarketDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() opensAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() closesAt?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  houseEdgePct?: number;
  @ApiProperty({
    type: [String],
    description: 'Outcome labels e.g. ["Team A wins","Draw","Team B wins"]',
  })
  outcomes: string[];
}

export class PlaceBetDto {
  @ApiProperty() @IsUUID() outcomeId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
}

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market) private marketRepo: Repository<Market>,
    @InjectRepository(Outcome) private outcomeRepo: Repository<Outcome>,
    private engine: ParimutuelEngine,
  ) {}

  async create(dto: CreateMarketDto): Promise<Market> {
    const market = this.marketRepo.create({
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl,
      opensAt: dto.opensAt ? new Date(dto.opensAt) : undefined,
      closesAt: dto.closesAt ? new Date(dto.closesAt) : undefined,
      houseEdgePct: dto.houseEdgePct ?? 5,
    });
    const saved = await this.marketRepo.save(market);

    const outcomes = dto.outcomes.map((label) =>
      this.outcomeRepo.create({ label, marketId: saved.id }),
    );
    await this.outcomeRepo.save(outcomes);
    return this.findOne(saved.id);
  }

  findAll(): Promise<Market[]> {
    return this.marketRepo.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: string): Promise<Market> {
    const market = await this.marketRepo.findOne({
      where: { id },
      relations: ["outcomes"],
    });
    if (!market) throw new NotFoundException("Market not found");
    return market;
  }

  placeBet(userId: string, marketId: string, dto: PlaceBetDto) {
    return this.engine.placeBet(userId, marketId, dto.outcomeId, dto.amount);
  }

  transition(marketId: string, to: MarketStatus) {
    return this.engine.transitionMarket(marketId, to);
  }

  resolve(marketId: string, winningOutcomeId: string) {
    return this.engine.resolveMarket(marketId, winningOutcomeId);
  }

  cancel(marketId: string) {
    return this.engine.cancelMarket(marketId);
  }
}
