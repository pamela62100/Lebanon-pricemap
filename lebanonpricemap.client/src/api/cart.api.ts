import client from './axiosClient';

export const cartApi = {
  getCart: async () => client.get('/cart'),

  addItem: async (data: { productId: string; quantity: number; storeId?: string }) =>
    client.post('/cart/items', data),

  removeItem: async (itemId: string) =>
    client.delete(`/cart/items/${itemId}`),

  updateQuantity: async (itemId: string, quantity: number) =>
    client.patch(`/cart/items/${itemId}`, { quantity }),

  clearCart: async () =>
    client.delete('/cart'),

  optimize: async () =>
    client.get('/cart/optimize'),
};
