import { NextRequest, NextResponse } from "next/server";
import { deleteGuestbookEntry } from "@/lib/data/guestbook";

// DELETE: 방명록 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "방명록 ID가 필요합니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const deleted = deleteGuestbookEntry(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "방명록을 찾을 수 없습니다.",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "방명록이 삭제되었습니다.",
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
        error: "방명록 삭제 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

