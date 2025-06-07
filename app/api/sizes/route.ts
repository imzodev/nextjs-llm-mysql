import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Size } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storeId = searchParams.get('storeId');
    
    if (id) {
      // Get a specific size by ID
      const size = await findById<Size>('Size', id);
      if (!size) {
        return NextResponse.json(
          { success: false, error: 'Size not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: size });
    } else if (storeId) {
      // Get sizes by store ID
      const sizes = await executeQuery<Size[]>(
        'SELECT * FROM Size WHERE storeId = ? ORDER BY name ASC',
        [storeId]
      );
      return NextResponse.json({ success: true, data: sizes });
    } else {
      // Get all sizes
      const sizes = await findAll<Size>('Size');
      return NextResponse.json({ success: true, data: sizes });
    }
  } catch (error) {
    console.error('Sizes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sizes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = new Date();
    const size = await create<Size>('Size', {
      id,
      ...body,
      createdAt: now,
      updatedAt: now
    });
    return NextResponse.json({ success: true, data: size }, { status: 201 });
  } catch (error) {
    console.error('Sizes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create size' },
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
        { success: false, error: 'Size ID is required' },
        { status: 400 }
      );
    }
    const body = await request.json();
    const size = await update<Size>('Size', id, {
      ...body,
      updatedAt: new Date()
    });
    return NextResponse.json({ success: true, data: size });
  } catch (error) {
    console.error('Sizes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update size' },
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
        { success: false, error: 'Size ID is required' },
        { status: 400 }
      );
    }
    await remove('Size', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sizes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete size' },
      { status: 500 }
    );
  }
}