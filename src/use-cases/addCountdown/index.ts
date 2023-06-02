import { ICountdownRepository } from "../../repositories/countdown.repository";
import { ILogger } from "../../ports/logger";
import { Inject, Service } from "typedi";
import {
  COUNTDOWN_REPOSITORY,
  USE_CASES_LOGGER,
  ID_GENERATOR,
  QUEUE_PUBLISHER,
  MESSAGE_PUBLISHED_TOPIC,
} from "../../constants";
import { IIDGenerator } from "../../ports/id-generator";
import { IQueue, MessageAttributeOperation } from "../../ports/queue";
import { Countdown } from "../../entities/countdown";

/**
 * Add new Example UseCase
 * @namespace Countdown
 */

@Service()
export class AddCountdown {
  @Inject(COUNTDOWN_REPOSITORY)
  private readonly repository: ICountdownRepository;

  @Inject(USE_CASES_LOGGER.ADD_COUNTDOWN_USE_CASE_LOGGER)
  public readonly logger: ILogger;

  @Inject(ID_GENERATOR)
  private readonly idGenerator: IIDGenerator;

  @Inject(QUEUE_PUBLISHER)
  private readonly queue: IQueue;

  constructor(
    repository: ICountdownRepository,
    logger: ILogger,
    idGenerator: IIDGenerator,
    queue: IQueue
  ) {
    this.repository = repository;
    this.logger = logger;
    this.idGenerator = idGenerator;
    this.queue = queue;
  }

  /**
   * UseCase executer
   *
   * @param countdown - New countdown to create
   * @returns The new countdown created
   */

  async execute({ name }: { name: string }): Promise<Countdown> {
    this.logger.info("Creating a new countdown item");

    const newCountdown = new Countdown({
      _id: this.idGenerator.generate(),
      name,
      date: new Date(),
    });

    await this.repository.save(newCountdown);

    this.logger.info("New countdown item created succesfully");
    
    this.queue.publish(MESSAGE_PUBLISHED_TOPIC, JSON.stringify(newCountdown), {
      version: "1",
      companyId: "2",
      collection: "countdown",
      operation: MessageAttributeOperation.CREATE,
    });

    return newCountdown;
  }
}
