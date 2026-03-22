import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtAuthGuard } from "../auth/guards";
import { User } from "../entities/user.entity";
import { Transaction } from "../entities/transaction.entity";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Get my profile & balance" })
  getMe(@Request() req) {
    return this.userRepo.findOne({
      where: { id: req.user.userId },
      select: [
        "id",
        "firstName",
        "lastName",
        "username",
        "photoUrl",
        "balance",
        "isAdmin",
        "createdAt",
      ],
    });
  }

  @Get("me/transactions")
  @ApiOperation({ summary: "Get my transaction history" })
  getTransactions(@Request() req) {
    return this.txRepo.find({
      where: { userId: req.user.userId },
      order: { createdAt: "DESC" },
      take: 50,
    });
  }
}
