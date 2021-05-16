export interface IProduct {
  item_id: number,
  created_time: string,
  updated_time: string,
  primary_category: number,
  skus: ISku[],
  attributes: IAttributes;
}

export interface ISku {
  SellerSku: string,
  color_family: string,
  size: string,
  quantity: number,
  special_price: number,
  price: number,
  package_length: string,
  package_height: string,
  package_width: string,
  package_weight: string,
  Images: string[]
}

export interface IAttributes{
  name: string,
  description: string,
  brand: string
}