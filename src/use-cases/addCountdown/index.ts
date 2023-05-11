import { ICountdownRepository } from "../../repositories/countdown.repository";
import { ILogger } from "../../ports/logger";
import { Inject, Service } from "typedi";
import { COUNTDOWN_REPOSITORY, USE_CASES_LOGGER } from "../../constants";

/**
 * Add new Example UseCase
 * @namespace Countdown
 */

@Service()
export class AddCountdown {
  @Inject(COUNTDOWN_REPOSITORY)
  private readonly repository: ICountdownRepository;

  @Inject(USE_CASES_LOGGER.ADD_USE_CASE_LOGGER)
  public readonly logger: ILogger;

  constructor(repository: ICountdownRepository, logger: ILogger) {
    this.repository = repository;
    this.logger = logger;
  }

  /**
   * UseCase executer
   *
   * @param countdown - New countdown to create
   * @returns The new countdown created
   */

  async execute(): Promise<undefined> {
    const newCountdown = undefined;

    // await this.repository.save(newCountdown);

    return newCountdown;
  }
}
