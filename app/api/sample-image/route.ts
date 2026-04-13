import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    // Corporate proxies may use self-signed certs for SSL inspection.
    // The undici-based fetch in Node 18+ honours this agent option.
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    };

    // Allow self-signed certs when running behind a corporate proxy
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
      // Already handled via env var
    }

    const response = await fetch(
      "https://thispersondoesnotexist.com/",
      fetchOptions
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sample image" },
        { status: 502 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sample image" },
      { status: 500 }
    );
  }
}
