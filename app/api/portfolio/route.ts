import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/data/portfolio";

export async function GET() {
  try {
    const portfolioData = await getPortfolioData();

    return NextResponse.json(
      {
        success: true,
        data: portfolioData,
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
        error: "포트폴리오 데이터를 불러오는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}