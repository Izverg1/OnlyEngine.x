import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, scheduledTime, platforms, targetSegments } = body

    // Schedule content distribution
    const response = await fetch(`${FASTAPI_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content_id: contentId,
        scheduled_time: scheduledTime,
        platforms,
        target_segments: targetSegments,
      }),
    })

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: {
        scheduleId: data.schedule_id,
        status: data.status,
        scheduledFor: data.scheduled_for,
      },
    })
  } catch (error) {
    console.error('Scheduling error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to schedule content',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get scheduled posts
    const response = await fetch(`${FASTAPI_URL}/api/schedule/list`)
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      schedules: data.schedules,
    })
  } catch (error) {
    console.error('Schedule list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch schedules',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const scheduleId = searchParams.get('id')

  if (!scheduleId) {
    return NextResponse.json(
      { error: 'Schedule ID required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/api/schedule/${scheduleId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Schedule cancelled',
    })
  } catch (error) {
    console.error('Cancel schedule error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel schedule',
      },
      { status: 500 }
    )
  }
}