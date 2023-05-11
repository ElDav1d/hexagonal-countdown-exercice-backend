/* eslint-disable @typescript-eslint/no-unused-vars */
import expect from "expect";
import sinon, { SinonFakeTimers } from "sinon";
import ExampleDataOutJSON from "../../../__mocks__/countdown/addCountdown/countdown-data-out.json";
import { AddCountdown } from ".";
import { FakeLogger } from "../../../__mocks__/ports/logger";
import { FakeCountdownRepository } from "../../../__mocks__/repositories/countdown.repository";

describe("addCountdown use-case", () => {
  const now = new Date("2023-01-01");
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("should create a new countdown successfully", async () => {
    const stubSave = sinon.stub(FakeCountdownRepository.prototype, "save");

    sinon.stub(FakeCountdownRepository.prototype, "getAll").resolves();
    sinon.stub(FakeLogger.prototype, "info");

    const addUseCase = new AddCountdown(
      new FakeCountdownRepository(),
      new FakeLogger()
    );

    const result = await addUseCase.execute();

    expect(result).toStrictEqual({
      ...ExampleDataOutJSON,
      date: now,
    });
  });
});
