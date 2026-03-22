import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("settlements")
export class Settlement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  marketId: string;

  @Column({ type: "uuid" })
  winningOutcomeId: string;

  @Column({ type: "int", default: 0 })
  totalBets: number;

  @Column({ type: "int", default: 0 })
  winningBets: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalPool: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  houseAmount: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  payoutPool: number;

  @Column({ type: "decimal", precision: 18, scale: 2, default: 0 })
  totalPaidOut: number;

  @CreateDateColumn()
  settledAt: Date;
}
