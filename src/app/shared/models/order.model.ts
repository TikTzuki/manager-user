export interface IOrder{
  order_id: string,
  created_at: string,
  updated_at: string,
  price: string,
  payment_method: string,
  shipping_fee: number,
  statuses: string[],
  address_shipping: any,
}