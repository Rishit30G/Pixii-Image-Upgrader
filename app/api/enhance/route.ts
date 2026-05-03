import { NextRequest, NextResponse } from 'next/server';

const CLAID_API_KEY = process.env.CLAID_API_KEY;
const UPLOAD_URL = 'https://api.claid.ai/v1-beta1/image/upload';
const SCENE_CREATE_URL = 'https://api.claid.ai/v1-ea/scene/create';

const DEFAULT_PROMPT =
  'Studio-quality product photograph of the image attached placed on a polished white marble tabletop, soft diffused softbox lighting, subtle shadows, ultra-realistic textures, clean minimal background, 8K detail, crisp focus, elegant composition. Shot on full-frame DSLR, 85mm lens, f/4 aperture, ISO 100, 1/125s shutter speed, shallow depth of field, high dynamic range.';
const NEGATIVE_PROMPT =
  'watermark, low quality, cartoon, pixelated, text, overlay';

// --- Simple in-memory rate limiter ---
// Limits each IP to a fixed number of requests within a sliding window.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 requests per minute per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Periodically clean up stale entries to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

// --- Timeout constant ---
const FETCH_TIMEOUT_MS = 30_000; // 30 seconds

export async function POST(request: NextRequest) {
  // --- Rate limit check ---
  const forwarded = request.headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  if (!CLAID_API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error: missing API key' },
      { status: 500 }
    );
  }

  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userPrompt = (formData.get('prompt') as string) || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG or PNG image.' },
        { status: 400 }
      );
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4MB.' },
        { status: 400 }
      );
    }

    // Step 1: Upload image to Claid to get a hosted URL
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const uploadResponse = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLAID_API_KEY}`,
      },
      body: uploadFormData,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text();
      console.error('Claid upload failed:', uploadResponse.status, uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 502 }
      );
    }

    const uploadData = await uploadResponse.json();
    const imageUrl = uploadData?.data?.url;

    if (!imageUrl) {
      console.error('Claid upload response missing URL:', uploadData);
      return NextResponse.json(
        { error: 'Upload succeeded but no image URL was returned.' },
        { status: 502 }
      );
    }

    // Step 2: Create scene with the uploaded image URL
    const scenePrompt = userPrompt.trim() || DEFAULT_PROMPT;

    const scenePayload = {
      object: {
        image_url: imageUrl,
        placement_type: 'original',
      },
      scene: {
        prompt: scenePrompt,
        negative_prompt: NEGATIVE_PROMPT,
        model: 'v2',
        aspect_ratio: '1:1',
        preference: 'best',
      },
      output: {
        number_of_images: 1,
        format: 'png',
      },
    };

    const sceneResponse = await fetch(SCENE_CREATE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLAID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenePayload),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!sceneResponse.ok) {
      const sceneError = await sceneResponse.text();
      console.error(
        'Claid scene create failed:',
        sceneResponse.status,
        sceneError
      );
      return NextResponse.json(
        { error: 'Image enhancement failed. Please try again.' },
        { status: 502 }
      );
    }

    const sceneData = await sceneResponse.json();
    const resultUrl =
      sceneData?.data?.output?.[0]?.tmp_url ||
      sceneData?.data?.output?.[0]?.url;

    if (!resultUrl) {
      console.error(
        'Claid scene response missing output URL:',
        JSON.stringify(sceneData, null, 2)
      );
      return NextResponse.json(
        { error: 'Enhancement completed but no result image was returned.' },
        { status: 502 }
      );
    }

    const outputEntry = sceneData?.data?.output?.[0];

    return NextResponse.json({
      url: resultUrl,
      width: outputEntry?.width,
      height: outputEntry?.height,
      format: outputEntry?.format,
    });
  } catch (error) {
    // Distinguish timeout errors from other failures
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error('Claid API timed out after', FETCH_TIMEOUT_MS, 'ms');
      return NextResponse.json(
        {
          error:
            'The image processing service is taking too long. Please try again.',
        },
        { status: 504 }
      );
    }

    console.error('Enhance API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
