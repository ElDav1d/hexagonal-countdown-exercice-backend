import { AddCountdown } from "../../../../../use-cases/addCountdown";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError, ManageError } from "../manage-error";
import { Container } from "typedi";
import { GetAllCountdowns } from "../../../../../use-cases/getAllCountdowns";
import { CountdownDTO } from "../../../DTOs/countdown.dto";

export class CountdownController {
  private readonly addCountDownUseCase = Container.get(AddCountdown);
  private readonly getAllCountdownsUseCase = Container.get(GetAllCountdowns);

  addCountdown = async (req: Request, res: Response): Promise<void> => {
    const countdown = req.body;
    try {
      this.addCountDownUseCase.logger.setCorrelationId(
        req.headers?.["correlation-id"]
      );
      await this.addCountDownUseCase.execute(countdown);
      res.status(StatusCodes.CREATED).end();
    } catch (error) {
      ManageError(error as CustomError, res, this.addCountDownUseCase.logger);
    }
  };

  getAllCountdowns = async (req: Request, res: Response): Promise<void> => {
    try {
      const countdowns = await this.getAllCountdownsUseCase.execute();
      const countdownsDTO = countdowns.map(countdown => new CountdownDTO(countdown));
      countdownsDTO.length > 0 ? res.status(StatusCodes.OK).json(countdownsDTO) : res.status(StatusCodes.NO_CONTENT).end();
      
    } catch (error) {
      ManageError(error as CustomError, res, this.getAllCountdownsUseCase.logger);
    }
  }
}