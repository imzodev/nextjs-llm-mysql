import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, findAll, findById, create, update, remove } from '@/lib/db';
import { Color } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const storeId = searchParams.get('storeId');
    
    if (id) {
      // Get a specific color by ID
      const color = await findById<Color>('Color', id);
      if (!color) {
        return NextResponse.json(
          { success: false, error: 'Color not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: color });
    } else if (storeId) {
      // Get colors by store ID
      const colors = await executeQuery<Color[]>(
        'SELECT * FROM Color WHERE storeId = ? ORDER BY name ASC',
        [storeId]
      );
      return NextResponse.json({ success: true, data: colors });
    } else {
      // Get all colors
      const colors = await findAll<Color>('Color');
      return NextResponse.json({ success: true, data: colors });
    }
  } catch (error) {
    console.error('Colors API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = new Date();
    const color = await create<Color>('Color', {
      id,
      ...body,
      createdAt: now,
      updatedAt: now
    });
    return NextResponse.json({ success: true, data: color }, { status: 201 });
  } catch (error) {
    console.error('Colors API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create color' },
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
        { success: false, error: 'Color ID is required' },
        { status: 400 }
      );
    }
    const body = await request.json();
    const color = await update<Color>('Color', id, {
      ...body,
      updatedAt: new Date()
    });
    return NextResponse.json({ success: true, data: color });
  } catch (error) {
    console.error('Colors API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update color' },
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
        { success: false, error: 'Color ID is required' },
        { status: 400 }
      );
    }
    await remove('Color', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Colors API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete color' },
      { status: 500 }
    );
  }
}
