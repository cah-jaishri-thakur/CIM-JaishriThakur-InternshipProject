export interface Transactions {
  /*cin: Number;
  account_nbr: Number;
  quantity: number;
  transaction_date: Date;
  transaction_type: number;
  max_qty: number;
  min_qty: number;
  mif_package_qty: number;
  on_hand: number;*/

  on_hand : number;
  quantity : number;
  min_qty : number;
  package_qty : number;
  brand_description : string;
  transaction_type : number;
  max_qty : number;
  cin : string;
  transaction_date: Date;
}
