import expect from 'expect'
import { GetAllCountdowns } from '.'

import sinon from 'sinon'

import ExampleDataOutJSON from '../../../__mocks__/countdown/getAllCountdowns/countdown-data-out.json'
import { FakeCountdownRepository } from '../../../__mocks__/repositories/countdown.repository'
import { FakeLogger } from '../../../__mocks__/ports/logger'

describe('getAllCountdowns use-case', () => {
    beforeEach(() => {
        sinon.restore()
      })
    
    it('should get all countdowns successfully', async () => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getAllCountdownsUseCase = new GetAllCountdowns(new FakeCountdownRepository(), new FakeLogger())
        const countdowns = await getAllCountdownsUseCase.execute();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(countdowns.map((countdown: any) => ({...countdown}))).toStrictEqual(ExampleDataOutJSON.map(example => ({...example})))
    })
})