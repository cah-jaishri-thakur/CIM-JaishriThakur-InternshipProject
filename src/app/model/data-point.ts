export class DataPoint {
  constructor(
    public x: number,
    public y: number,
    public transactionDate: Date,
    public transactionType: string,
    public quantity: number,
    public currentOnHand: number,
    public pkgQty: number
  ) {
  }
}
