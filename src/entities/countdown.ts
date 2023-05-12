export interface ICountdown {
  _id: string;
  name: string;
  date: Date;
}
export class Countdown implements ICountdown {
  readonly _id: string;
  name: string;
  date: Date;

  constructor({ _id, name, date }: ICountdown) {
    this._id = _id;
    this.name = name;
    this.date = date;
  }
}
