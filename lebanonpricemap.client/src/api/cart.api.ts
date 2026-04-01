import client from './axiosClient';

export const cartApi = {
  // GET /api/cart — get the logged-in user's cart
  getCart: async () => {
    return client.get('/cart');
  },

  // POST /api/cart/items — add a product to the cart
  addItem: async (data: {
    productId: string;
    quantity: number;
    storeId?: string;
  }) => {
    return client.post('/cart/items', data);
  },

  // GET /api/cart/optimize — get cheapest store breakdown for the cart
  optimize: async () => {
    return client.get('/cart/optimize');
  },
};
