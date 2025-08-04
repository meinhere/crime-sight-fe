import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Forward request to FastAPI backend
    const url = process.env.FASTAPI_URL || "http://127.0.0.1:8000";
    const apiUrl = url + "/api/cluster";
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const queryString = new URLSearchParams(queryParams).toString();

    const response = await fetch(`${apiUrl}?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const res = await response.json();
      return NextResponse.json(
        {
          message: "Failed to fetch data from FastAPI",
          detail: res.detail || "Unknown error",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        detail: "Internal server error: ",
      },
      { status: 500 }
    );
  }
}
