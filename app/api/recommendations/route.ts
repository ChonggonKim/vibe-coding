import { NextRequest, NextResponse } from "next/server";
import {
  getRandomRecommendations,
  getAllRecommendations,
} from "@/lib/data/recommendations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = searchParams.get("count");
    const count = countParam ? Number.parseInt(countParam, 10) : 1;

    const recommendations = countParam
      ? await getRandomRecommendations(count)
      : await getRandomRecommendations(1);

    const pool = await getAllRecommendations();

    return NextResponse.json(
      {
        success: true,
        data: {
          recommendations,
          totalPoolSize: pool.length,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "추천 문구를 불러오는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

