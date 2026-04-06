import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import {
  JobName,
  NOTIFICATION_QUEUE,
  PaymentSuccessJobData,
  MarketSettledJobData,
  BetResultJobData,
} from "./notification.queue";

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case JobName.PAYMENT_SUCCESS: {
        const data = job.data as PaymentSuccessJobData;
        this.logger.log(
          `[payment.success] user=${data.userId} amount=${data.amount} ${data.currency} paymentId=${data.paymentId}`,
        );
        // TODO: inject TelegramSimpleService and send a "your deposit of X BTN is confirmed" message
        break;
      }

      case JobName.MARKET_SETTLED: {
        const data = job.data as MarketSettledJobData;
        this.logger.log(
          `[market.settled] market=${data.marketId} winner="${data.winningOutcomeLabel}"`,
        );
        // TODO: broadcast settlement announcement via TelegramSimpleService
        break;
      }

      case JobName.BET_RESULT: {
        const data = job.data as BetResultJobData;
        this.logger.log(
          `[position.result] user=${data.userId} position=${data.positionId} status=${data.status} payout=${data.payout ?? 0}`,
        );
        // TODO: send individual win/loss DM via TelegramSimpleService
        break;
      }

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
