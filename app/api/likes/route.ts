import { NextRequest, NextResponse } from "next/server";
import {
  getLikesCount,
  getAllLikesCounts,
  toggleLike,
  checkLikeStatus,
} from "@/lib/data/likes";

// GET: 현재 좋아요 수 및 사용자 좋아요 상태 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const voteId = searchParams.get("voteId");
    const userId = request.headers.get("x-user-id") || "";

    // voteId가 없으면 모든 투표 항목의 좋아요 수 반환
    if (!voteId) {
      const allCounts = await getAllLikesCounts();
      const allStatuses: Record<string, boolean> = {};
      if (userId) {
        for (const id of Object.keys(allCounts)) {
          allStatuses[id] = await checkLikeStatus(id, userId);
        }
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            counts: allCounts,
            statuses: allStatuses,
          },
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // 특정 투표 항목의 좋아요 수 및 상태 반환
    const count = await getLikesCount(voteId);
    const isLiked = userId ? await checkLikeStatus(voteId, userId) : false;

    return NextResponse.json(
      {
        success: true,
        data: {
          count,
          isLiked,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "좋아요 수를 불러오는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST: 좋아요 토글 (추가/취소)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, voteId } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "사용자 ID가 필요합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!voteId || typeof voteId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "투표 항목 ID가 필요합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

  const result = await toggleLike(voteId, userId);

    return NextResponse.json(
      {
        success: true,
        data: {
          count: result.count,
          isLiked: result.isLiked,
        },
        message: result.isLiked
          ? "좋아요가 추가되었습니다."
          : "좋아요가 취소되었습니다.",
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "좋아요 토글 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

