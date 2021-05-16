export interface IProductForm {
  primaryCategory: string,
  attributes: IAttributesForm,
  skus: ISkuForm[]
}

export interface ISkuForm {
  sellerSku:string,
  colorFamily:string,
  size:string,
  quantity: number,
  price: number,
  packageLength: string,
  packageHeight: string,
  packageWidth: string,
  packageWeight: string
  images: string[]
}

export interface IAttributesForm {
  name: string,
  description: string,
  brand: string
}