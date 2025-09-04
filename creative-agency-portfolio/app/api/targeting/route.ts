import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, platforms, segments } = body

    // Call FastAPI backend for targeting analysis
    const response = await fetch(`${FASTAPI_URL}/api/targeting/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_id: contentId,
        platforms,
        segments,
      }),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: {
        suggestions: data.suggestions,
        estimatedReach: data.estimated_reach,
        recommendedTime: data.recommended_time,
      },
    })
  } catch (error) {
    console.error('Targeting error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze targeting',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get available segments from FastAPI
    const response = await fetch(`${FASTAPI_URL}/api/targeting/segments`)
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      segments: data.segments,
    })
  } catch (error) {
    console.error('Segments fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch segments',
      },
      { status: 500 }
    )
  }
}