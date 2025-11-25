export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

// 메모리 기반 저장소 (개발용, 프로덕션에서는 DB 사용 권장)
let guestbookEntries: GuestbookEntry[] = [
  {
    id: "1",
    name: "바이브 코딩",
    message: "첫 번째 방명록입니다! 환영합니다 🎉",
    createdAt: new Date().toISOString(),
  },
];

import supabase from '@/lib/supabase';

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  // Supabase가 설정되어 있으면 DB에서 읽음, 아니면 메모리 사용
  if (supabase) {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase guestbook select error', error);
      return guestbookEntries;
    }

    // DB 스키마와 기존 타입을 맞추기 위해 맵핑
    return (
      (data as any[]).map((r) => ({
        id: String(r.id),
        name: r.name,
        message: r.message,
        createdAt: new Date(r.created_at).toISOString(),
      })) || []
    );
  }

  return guestbookEntries;
}

export async function addGuestbookEntry(name: string, message: string): Promise<GuestbookEntry> {
  const newEntry: GuestbookEntry = {
    id: Date.now().toString(),
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('guestbook').insert([
      {
        id: newEntry.id,
        name: newEntry.name,
        message: newEntry.message,
        created_at: newEntry.createdAt,
      },
    ]);
    if (error) {
      console.error('Supabase guestbook insert error', error);
      // fallback: 메모리
      guestbookEntries = [newEntry, ...guestbookEntries];
    }
    return newEntry;
  }

  guestbookEntries = [newEntry, ...guestbookEntries];
  return newEntry;
}

export async function deleteGuestbookEntry(id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from('guestbook').delete().eq('id', id);
    if (error) {
      console.error('Supabase guestbook delete error', error);
      return false;
    }
    return true;
  }

  const index = guestbookEntries.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return false;
  }
  guestbookEntries = guestbookEntries.filter((entry) => entry.id !== id);
  return true;
}

