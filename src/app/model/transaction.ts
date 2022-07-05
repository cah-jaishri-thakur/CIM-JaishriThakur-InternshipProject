export class Transaction {
  constructor(
    public transaction_type: string,
    public transaction_date: Date,
    public quantity: number,
    public min_quantity: number,
    public max_quantity: number
  ) {
  }
}
