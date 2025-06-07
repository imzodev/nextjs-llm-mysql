import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Category } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storeId = searchParams.get('storeId');
    
    if (id) {
      // Get a specific category by ID
      const category = await findById<Category>('Category', id);
      
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: category });
    } else if (storeId) {
      // Get categories by store ID
      const categories = await executeQuery<Category[]>(
        'SELECT * FROM Category WHERE storeId = ? ORDER BY name ASC',
        [storeId]
      );
      
      return NextResponse.json({ success: true, data: categories });
    } else {
      // Get all categories
      const categories = await findAll<Category>('Category');
      return NextResponse.json({ success: true, data: categories });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate a UUID for the category
    const id = crypto.randomUUID();
    const category = await create<Category>('Category', {
      id,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const category = await update<Category>('Category', id, {
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    await remove('Category', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
