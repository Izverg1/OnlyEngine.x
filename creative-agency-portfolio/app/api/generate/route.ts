import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style, quality } = body

    // Call FastAPI backend
    const response = await fetch(`${FASTAPI_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        style: style || 'photorealistic',
        quality: quality || 'standard',
        workflow: 'comfyui',
      }),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: data.status,
        imageUrl: data.image_url,
        metadata: data.metadata,
      },
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate content',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Generation ID required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/api/generate/${id}`)
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check generation status',
      },
      { status: 500 }
    )
  }
}