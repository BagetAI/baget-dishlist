import { NextResponse } from 'next/server';

const DISHES_DB_ID = '2c498536-0482-4e57-ac8b-4e7b5cea3042';

/**
 * DishList Log Endpoint
 * Expected payload:
 * {
 *   "place_id": string,
 *   "dish_name": string,
 *   "image_url": string,
 *   "memory_notes": string,
 *   "rating": number (optional, 1-5)
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { place_id, dish_name, image_url, memory_notes, rating = 5 } = body;

    // Validation
    if (!place_id || !dish_name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: place_id and dish_name are required.' 
      }, { status: 400 });
    }

    // Map to Database Schema
    const rowData = {
      venue_id: place_id,
      name: dish_name,
      photo_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      user_notes: memory_notes || '',
      rating: Number(rating)
    };

    const response = await fetch(`https://baget.ai/api/public/databases/${DISHES_DB_ID}/rows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: rowData }),
    });

    if (!response.ok) {
      throw new Error('Database insertion failed');
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Dish logged successfully in your Taste Passport',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
