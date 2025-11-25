import { NextRequest, NextResponse } from "next/server";
import {
  getGuestbookEntries,
  addGuestbookEntry,
  type GuestbookEntry,
} from "@/lib/data/guestbook";

// GET: 방명록 목록 조회
export async function GET() {
  try {
  const entries = await getGuestbookEntries();
    return NextResponse.json(
      {
        success: true,
        data: entries,
        count: entries.length,
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
        error: "방명록을 불러오는 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST: 새 방명록 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message } = body;

    // 유효성 검사
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "이름을 입력해주세요.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "메시지를 입력해주세요.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "이름은 50자 이하로 입력해주세요.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "메시지는 500자 이하로 입력해주세요.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

  const newEntry = await addGuestbookEntry(name.trim(), message.trim());

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
        message: "방명록이 작성되었습니다.",
        timestamp: new Date().toISOString(),
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록 작성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

