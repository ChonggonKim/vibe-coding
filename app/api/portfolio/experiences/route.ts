import { NextResponse } from "next/server";
import { portfolioData } from "@/lib/data/portfolio";

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: portfolioData.experiences,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "경력 데이터를 불러오는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

