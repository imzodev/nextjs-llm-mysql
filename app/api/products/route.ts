import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Product } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const storeId = searchParams.get('storeId');
    
    let products: Product[];
    
    if (id) {
      // Get a specific product by ID
      const product = await findById<Product>('Product', id);
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      
      // Get product images
      const images = await executeQuery<any[]>(
        'SELECT * FROM Image WHERE productId = ?',
        [id]
      );
      
      // Get product category
      const [category] = await executeQuery<any[]>(
        'SELECT * FROM Category WHERE id = ?',
        [product.categoryId]
      );
      
      return NextResponse.json({
        success: true,
        data: {
          ...product,
          images,
          category
        }
      });
    } else if (categoryId) {
      // Get products by category
      products = await executeQuery<any[]>(
        `SELECT p.*, c.name as colorName, c.value as colorValue FROM Product p
         LEFT JOIN Color c ON p.colorId = c.id
         WHERE p.categoryId = ? ORDER BY p.createdAt DESC`,
        [categoryId]
      );
      products = products.map(p => {
        const { colorName, colorValue, ...rest } = p;
        return {
          ...rest,
          color: (typeof colorName === "string" && typeof colorValue === "string") ? { name: colorName, value: colorValue } : undefined
        };
      });
    } else if (storeId) {
      // Get products by store
      products = await executeQuery<any[]>(
        `SELECT p.*, c.name as colorName, c.value as colorValue FROM Product p
         LEFT JOIN Color c ON p.colorId = c.id
         WHERE p.storeId = ? ORDER BY p.createdAt DESC`,
        [storeId]
      );
      // Attach color as nested object if present
      products = products.map(p => {
        const { colorName, colorValue, ...rest } = p;
        return {
          ...rest,
          color: (typeof colorName === "string" && typeof colorValue === "string") ? { name: colorName, value: colorValue } : undefined
        };
      });
    } else {
      // Get all products
      products = await executeQuery<any[]>(
        `SELECT p.*, c.name as colorName, c.value as colorValue FROM Product p
         LEFT JOIN Color c ON p.colorId = c.id
         ORDER BY p.createdAt DESC`
      );
      products = products.map(p => {
        const { colorName, colorValue, ...rest } = p;
        return {
          ...rest,
          color: (typeof colorName === "string" && typeof colorValue === "string") ? { name: colorName, value: colorValue } : undefined
        };
      });
    }
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate a UUID for the product
    const id = crypto.randomUUID();
    const product = await create<Product>('Product', {
      id,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
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
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const product = await update<Product>('Product', id, {
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
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
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await remove('Product', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
