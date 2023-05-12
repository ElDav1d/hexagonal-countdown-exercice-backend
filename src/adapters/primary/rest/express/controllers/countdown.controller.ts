import { AddCountdown } from "../../../../../use-cases/addCountdown";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError, ManageError } from "../manage-error";
import { Container } from "typedi";

export class CountdownController {
  private readonly addCountDownUseCase = Container.get(AddCountdown);

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
}
