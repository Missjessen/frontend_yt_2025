export type Product = {

  _id: string;
  name: string;
  description: string;
  imageURL: string;
  price: number;
  stock: number;
  isONdiscount: boolean;
  discountPct: number;
  isHidden: boolean;
  _createdBy: string;

}

export type newProducts = Omit<Product, '_id'> & { _createdBy?: string }

export type User =
{

id: string,
name: string,
email: string,
password: string,
createdAt: string


}


