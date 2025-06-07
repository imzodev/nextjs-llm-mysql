import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Supplier } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storeId = searchParams.get('storeId');
    
    if (id) {
      // Get a specific supplier by ID
      const supplier = await findById<Supplier>('Supplier', id);
      
      if (!supplier) {
        return NextResponse.json(
          { success: false, error: 'Supplier not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: supplier });
    } else if (storeId) {
      // Get suppliers by store ID
      const suppliers = await executeQuery<Supplier[]>(
        'SELECT * FROM Supplier WHERE storeId = ? ORDER BY name ASC',
        [storeId]
      );
      
      return NextResponse.json({ success: true, data: suppliers });
    } else {
      // Get all suppliers
      const suppliers = await findAll<Supplier>('Supplier');
      return NextResponse.json({ success: true, data: suppliers });
    }
  } catch (error) {
    console.error('Suppliers API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate a UUID for the supplier
    const id = crypto.randomUUID();
    const supplier = await create<Supplier>('Supplier', {
      id,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: supplier }, { status: 201 });
  } catch (error) {
    console.error('Suppliers API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create supplier' },
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
        { success: false, error: 'Supplier ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const supplier = await update<Supplier>('Supplier', id, {
      ...body,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: supplier });
  } catch (error) {
    console.error('Suppliers API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update supplier' },
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
        { success: false, error: 'Supplier ID is required' },
        { status: 400 }
      );
    }
    
    await remove('Supplier', id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Suppliers API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}
