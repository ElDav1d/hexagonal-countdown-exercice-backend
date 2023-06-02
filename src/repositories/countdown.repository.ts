import { Countdown } from "../entities/countdown";

export interface ICountdownRepository {
  /**
   * Save a countdown
   *
   * @param countdown - New Countdown to create
   */
  save(countdown: Countdown): Promise<void>;

    /**
   * Get all examples
   *
   * @return All examples
   */

  getAll(): Promise<Countdown[]>
}
