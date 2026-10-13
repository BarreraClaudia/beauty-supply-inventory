export function getStockStatus(product) {
  if (product.quantity === 0) return { key: 'out', label: 'Out of Stock' };

  if (product.quantity <= product.reorder_level)
    return { key: 'low', label: 'Low Stock' };

  return { key: 'in', label: 'In Stock' };
}
