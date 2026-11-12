import { api } from "../apiClient";

export async function getAllProducts() {
  return api.get("/products");
}

export async function createProduct(name: string) {
  return api.post("/products", { name });
}

export async function getProductById(productId: string) {
  return api.get(`/products/${productId}`);
}

export async function updateProduct(productId: string, name: string) {
  return api.patch(`/products/${productId}`, { name });
}

export async function deleteProduct(productId: string) {
  return api.delete(`/products/${productId}`);
}
