import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, getAllProducts } from "./api";

export function useProducts() {
  const products = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
  });

  return products;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const createProductMutation = useMutation({
    mutationFn: (name: string) => createProduct(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return createProductMutation;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return deleteProductMutation;
}
