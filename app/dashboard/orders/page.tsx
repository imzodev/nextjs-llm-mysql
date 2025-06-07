"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order, OrderItem, Product } from "@/types";
import { 
  Eye, 
  Search, 
  ShoppingCart,
  Check,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<(OrderItem & { product?: Product })[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        
        if (ordersData.success) {
          setOrders(ordersData.data);
        }
        
        // Fetch products for reference
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        if (productsData.success) {
          setProducts(productsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
    
    try {
      const response = await fetch(`/api/orders?id=${order.id}`);
      const data = await response.json();
      
      if (data.success && data.data.items) {
        // Enrich order items with product details
        const enrichedItems = data.data.items.map((item: OrderItem) => {
          const product = products.find(p => p.id === item.productId);
          return { ...item, product };
        });
        
        setOrderItems(enrichedItems);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleToggleOrderPaid = async (orderId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPaid: !currentStatus
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, isPaid: !currentStatus } : o
        ));
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, isPaid: !currentStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const calculateOrderTotal = (items: (OrderItem & { product?: Product })[]) => {
    return items.reduce((total, item) => {
      return total + (item.product?.price || 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage customer orders.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by ID..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Loading orders...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </TableCell>
                        <TableCell>{order.address || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant={order.isPaid ? "destructive" : "default"}
                              size="icon"
                              onClick={() => handleToggleOrderPaid(order.id, order.isPaid)}
                            >
                              {order.isPaid ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>
                  Order #{selectedOrder.id.substring(0, 8)} • 
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedOrder?.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedOrder?.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              
              <Button
                variant={selectedOrder?.isPaid ? "destructive" : "default"}
                size="sm"
                onClick={() => selectedOrder && handleToggleOrderPaid(selectedOrder.id, selectedOrder.isPaid)}
              >
                {selectedOrder?.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p>{selectedOrder?.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Address:</span>
                  <p>{selectedOrder?.address || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product?.name || 'Unknown Product'}</TableCell>
                          <TableCell className="text-right">${item.product?.price.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4">
                          No items in this order
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        ${calculateOrderTotal(orderItems).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
