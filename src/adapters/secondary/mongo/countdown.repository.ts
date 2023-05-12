import { MongoClient } from "mongodb";
import { ICountdownRepository } from "../../../repositories/countdown.repository";
import { Countdown, ICountdown } from "../../../entities/countdown";
import { ILogger } from "../../../ports/logger";

export class MongoCountdownRepository implements ICountdownRepository {
  private readonly client: MongoClient;
  private readonly logger: ILogger;
  private readonly COLLECTION = "countdown";

  constructor(client: MongoClient, logger: ILogger) {
    this.client = client;
    this.logger = logger;
  }

  async save(countdown: Countdown): Promise<void> {
    this.logger.info("Saving entity countdown in the database");
    await this.client
      .db()
      .collection<ICountdown>(this.COLLECTION)
      .insertOne(countdown);
  }
}
