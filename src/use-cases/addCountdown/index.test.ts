/* eslint-disable @typescript-eslint/no-unused-vars */
import expect from "expect";
import sinon, { SinonFakeTimers } from "sinon";
import CountdownDataInJSON from "../../../__mocks__/countdown/addCountdown/countdown-data-in.json";
import CountdownDataOutJSON from "../../../__mocks__/countdown/addCountdown/countdown-data-out.json";
import { AddCountdown } from ".";
import { FakeIdGenerator } from "../../../__mocks__/ports/id-generator";
import { FakeQueue } from "../../../__mocks__/ports/queue";
import { FakeLogger } from "../../../__mocks__/ports/logger";
import { FakeCountdownRepository } from "../../../__mocks__/repositories/countdown.repository";

describe("addCountdown use-case", () => {
  const now = new Date("2023-01-01");
  let clock: SinonFakeTimers;

  beforeEach(() => {
    sinon.restore();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("should create a new countdown successfully", async () => {
    const stubSave = sinon.stub(FakeCountdownRepository.prototype, "save");

    sinon.stub(FakeCountdownRepository.prototype, "getAll").resolves();
    sinon.stub(FakeIdGenerator.prototype, "generate").returns("456");
    sinon.stub(FakeQueue.prototype, "publish").resolves();
    sinon.stub(FakeLogger.prototype, "info");

    const addUseCase = new AddCountdown(
      new FakeCountdownRepository(),
      new FakeLogger(),
      new FakeIdGenerator(),
      new FakeQueue()
    );

    const result = await addUseCase.execute(CountdownDataInJSON);

    expect({ ...result }).toStrictEqual({
      ...CountdownDataOutJSON,
      date: now,
    });
  });
});
