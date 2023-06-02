import { Countdown, ICountdown } from '../../../entities/countdown'

export class CountdownDTO {
    private readonly countdown: Countdown
  
    constructor(countdown: Countdown) {
      this.countdown = countdown
    }
  
    toJSON(): Pick<ICountdown, '_id' | 'name'> {
      return {
        _id: this.countdown._id,
        name: this.countdown.name,
      }
    }
  }
  