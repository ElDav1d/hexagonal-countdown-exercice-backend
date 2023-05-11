/* eslint-disable @typescript-eslint/no-unused-vars */
import { Countdown } from "../../src/entities/countdown";
import { ICountdownRepository } from "../../src/repositories/countdown.repository";

export class FakeCountdownRepository implements ICountdownRepository {
  save(countdown: Countdown): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<Countdown[]> {
    return Promise.resolve([]);
  }
}
