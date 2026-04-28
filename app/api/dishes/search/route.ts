import { NextResponse } from 'next/server';

const DISHES_DB_ID = '2c498536-0482-4e57-ac8b-4e7b5cea3042';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase();
  
  try {
    const response = await fetch(`https://app.baget.ai/api/public/databases/${DISHES_DB_ID}/rows`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dishes from database');
    }
    
    const dishes = await response.json();
    
    // Filtering logic
    const filteredDishes = dishes.filter((dish: any) => {
      const matchesQuery = !q || 
        dish.name?.toLowerCase().includes(q) || 
        dish.user_notes?.toLowerCase().includes(q) ||
        dish.venue_id?.toLowerCase().includes(q);
      
      const matchesCategory = !category || 
        dish.category?.toLowerCase() === category;
        
      return matchesQuery && matchesCategory;
    });

    return NextResponse.json({
      success: true,
      data: filteredDishes,
      count: filteredDishes.length,
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
