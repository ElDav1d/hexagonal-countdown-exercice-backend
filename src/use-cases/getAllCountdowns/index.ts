import { ICountdownRepository } from '../../repositories/countdown.repository'
import { Countdown } from "../../entities/countdown";
import { ILogger } from '../../ports/logger'
import { Inject, Service } from 'typedi'
import { COUNTDOWN_REPOSITORY, USE_CASES_LOGGER } from '../../constants';

/**
 * Get all examples UseCase
 * @namespace Countdown
 */

@Service()
export class GetAllCountdowns {
    @Inject(COUNTDOWN_REPOSITORY)
    private readonly repository: ICountdownRepository

    @Inject(USE_CASES_LOGGER.GET_ALL_COUNTDOWNS_USE_CASE_LOGGER)
    public readonly logger: ILogger

    constructor(repository:ICountdownRepository, logger: ILogger ) {
        this.repository = repository
        this.logger = logger
    }
    
    async execute(): Promise<Countdown[]> {
        return []
    }
}