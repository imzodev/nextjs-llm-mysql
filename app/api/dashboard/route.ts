import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { DashboardStats, Order, Product } from '@/types';

export async function GET() {
  try {
    // Get total products
    const [productResult] = await executeQuery<[{count: number}]>(
      'SELECT COUNT(*) as count FROM Product'
    );
    const totalProducts = productResult?.count || 0;
    
    // Get total orders
    const [orderResult] = await executeQuery<[{count: number}]>(
      'SELECT COUNT(*) as count FROM `Order`'
    );
    const totalOrders = orderResult?.count || 0;
    
    // Get total revenue
    const [revenueResult] = await executeQuery<[{total: number}]>(
      'SELECT SUM(p.price) as total FROM OrderItem oi ' +
      'JOIN Product p ON oi.productId = p.id ' +
      'JOIN `Order` o ON oi.orderId = o.id ' +
      'WHERE o.isPaid = true'
    );
    const totalRevenue = revenueResult?.total || 0;
    
    // Get total suppliers
    const [supplierResult] = await executeQuery<[{count: number}]>(
      'SELECT COUNT(*) as count FROM Supplier'
    );
    const totalSuppliers = supplierResult?.count || 0;
    
    // Get recent orders
    const recentOrders = await executeQuery<Order[]>(
      'SELECT * FROM `Order` ORDER BY createdAt DESC LIMIT 5'
    );
    
    // Get top products by sales
    const topProducts = await executeQuery<Product[]>(
      'SELECT p.*, COUNT(oi.id) as salesCount ' +
      'FROM Product p ' +
      'LEFT JOIN OrderItem oi ON p.id = oi.productId ' +
      'GROUP BY p.id ' +
      'ORDER BY salesCount DESC ' +
      'LIMIT 5'
    );
    
    // Product category sales data (count products per category name)
    const productCategoryData = await executeQuery<{
      name: string;
      value: number;
    }[]>(
      `SELECT c.name as name, COUNT(p.id) as value
         FROM Product p
         JOIN Category c ON p.categoryId = c.id
         GROUP BY c.id, c.name
         ORDER BY value DESC
         LIMIT 5`
    );

    // Monthly sales data (items sold per month, Jan-Jun, current year)
    const monthlySalesData = await executeQuery<{
      name: string;
      sales: number;
    }[]>(
      `SELECT DATE_FORMAT(o.createdAt, '%b') as name, COUNT(oi.id) as sales
         FROM \`Order\` o
         JOIN OrderItem oi ON o.id = oi.orderId
         WHERE o.isPaid = TRUE
           AND YEAR(o.createdAt) = YEAR(CURDATE())
           AND MONTH(o.createdAt) BETWEEN 1 AND 6
         GROUP BY MONTH(o.createdAt), name
         ORDER BY MONTH(o.createdAt)`
    );
    

    const stats: DashboardStats & {
      productCategoryData: { name: string; value: number }[];
      monthlySalesData: { name: string; sales: number }[];
    } = {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalSuppliers,
      recentOrders,
      topProducts,
      productCategoryData,
      monthlySalesData
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
