import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Order, OrderItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storeId = searchParams.get('storeId');
    
    if (id) {
      // Get a specific order by ID
      const order = await findById<Order>('`Order`', id);
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Get order items with product details
      const orderItems = await executeQuery<OrderItem[]>(
        `SELECT oi.*, p.name, p.price, p.sku 
         FROM OrderItem oi
         JOIN Product p ON oi.productId = p.id
         WHERE oi.orderId = ?`,
        [id]
      );
      
      return NextResponse.json({
        success: true,
        data: {
          ...order,
          items: orderItems
        }
      });
    } else if (storeId) {
      // Get orders by store ID
      const orders = await executeQuery<Order[]>(
        'SELECT * FROM `Order` WHERE storeId = ? ORDER BY createdAt DESC',
        [storeId]
      );
      
      return NextResponse.json({ success: true, data: orders });
    } else {
      // Get all orders
      const orders = await findAll<Order>('`Order`');
      return NextResponse.json({ success: true, data: orders });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, ...orderData } = body;
    
    // Generate a UUID for the order
    const orderId = crypto.randomUUID();
    
    // Create the order
    await create<Order>('`Order`', {
      id: orderId,
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Create order items
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await create<OrderItem>('OrderItem', {
          id: crypto.randomUUID(),
          orderId,
          productId: item.productId
        });
      }
    }
    
    // Get the created order with items
    const order = await findById<Order>('`Order`', orderId);
    const orderItems = await executeQuery<OrderItem[]>(
      'SELECT * FROM OrderItem WHERE orderId = ?',
      [orderId]
    );
    
    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: orderItems
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const order = await update<Order>('`Order`', id, {
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Delete order items first (due to foreign key constraints)
    await executeQuery(
      'DELETE FROM OrderItem WHERE orderId = ?',
      [id]
    );
    
    // Delete the order
    await remove('`Order`', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
