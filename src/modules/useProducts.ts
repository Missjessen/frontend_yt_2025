import { ref } from 'vue';
import type {newProducts, Product} from '../interfaces/interfaces';
import type { promise } from 'dns';





export const useProducts = () => {

  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const products = ref<Product[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(`${API_URL}/products`
      );
      if (!response.ok) {
        throw new Error('No data available');
      }
      const data: Product[] = await response.json();
      products.value = data;
      console.log("products fetched", products.value);
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false;
    }
  }

  const getTokenAndUserId = () : { token: string, userId: string} => {
    const token = localStorage.getItem('lsToken');

    const userId = localStorage.getItem('userIDToken');

    if (!token) {
      throw new Error('No token available');
    }
    if (!userId) {
      throw new Error('No userId available');
    }
    return { token, userId }

  }

const validateProduct = (product: newProducts):void => {
  if (!product.name) {
    throw new Error('Name is required');
  }
}
  const setDefaultValues = (product: newProducts, userId: string) => {
    return {

      name: product.name,
      description: product.description || 'new product description default value',
      imageURL: product.imageURL || 'https://picsum.photos/500/500',
      price: product.price || 2,
      stock: product.stock || 50,
      isONdiscount: product.isONdiscount || false,
      discountPct: product.discountPct || 0,
      isHidden: product.isHidden || false,
      _createdBy: userId

    }
  }

  const addProducts = async ( product: newProducts ): Promise<void> => {
    try {

      const { token, userId } = getTokenAndUserId();
      validateProduct(product)
      const productWihtDefaults = setDefaultValues(product, userId);


      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(productWihtDefaults)

        })

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error ||'No data available');
      }

      const newProduct: Product = await response.json();
      products.value.push(newProduct);
      console.log("product added", newProduct);
      await fetchProducts();

      }
      catch (err) {
        error.value = (err as Error).message
      }
  }

const deleteProductFromServer = async (id:string, token:string ): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'auth-token': token
    }
})

if (!response.ok) {
  throw new Error('No data available');
  console.log("product not deleted", id);
}
}

const removeProductFromState = (id: string): void => {
  products.value = products.value.filter(product => product._id !== id);
  console.log("product deleted", id);
}


  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteProductFromServer(id, token);
      removeProductFromState(id);

    }


    catch (err) {
      error.value = (err as Error).message
    }

  }

  const updateProductOnServer = async (id: string, updateProduct: Partial<Product>, token: string): Promise<Product> => {
    const response = await fetch(`${API_URL}products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify(updateProduct)
    })
    if (!response.ok) {

      throw new Error('No data available');
    }
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    }
    catch{
      return { message: responseText } as unknown as Product;
    //return await response.json();


  }
}


const updateProductInState = (id: string, updatedProduct: Product): void => {
  const index = products.value.findIndex(product => product._id === id);
  if (index !== -1) {
    products.value[index] = updatedProduct;
  }
}

const updateProduct = async (id: string, updatedProduct: Partial<Product>): Promise<void> => {
  try {
    const { token } = getTokenAndUserId();
    const updatedProductResponse = await updateProductOnServer(id, updatedProduct, token);
    updateProductInState(id, updatedProductResponse);
    await fetchProducts();
  }
  catch (err) {
    error.value = (err as Error).message
  }
}


return { error, loading, products, fetchProducts, deleteProduct, addProducts, getTokenAndUserId, updateProduct };

}


