import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./user.entity";
import { Market } from "./market.entity";
import { Outcome } from "./outcome.entity";

export enum PositionStatus {
  PENDING = "pending",
  WON = "won",
  LOST = "lost",
  REFUNDED = "refunded",
}

// Back-compat alias so any remaining references compile during migration
export { PositionStatus as BetStatus };

@Index(["userId", "marketId"])
@Entity("positions")
export class Position {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 18, scale: 2 })
  amount: number;

  @Column({ type: "enum", enum: PositionStatus, default: PositionStatus.PENDING })
  status: PositionStatus;

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  oddsAtPlacement: number;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  payout: number;

  @CreateDateColumn()
  placedAt: Date;

  @ManyToOne(() => User, (u) => u.positions, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Market, (m) => m.positions)
  @JoinColumn()
  market: Market;

  @Column()
  marketId: string;

  @ManyToOne(() => Outcome, (o) => o.positions)
  @JoinColumn()
  outcome: Outcome;

  @Column()
  outcomeId: string;
}

// Back-compat alias
export { Position as Bet };
