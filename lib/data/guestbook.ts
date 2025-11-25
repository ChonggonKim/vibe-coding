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

export function getGuestbookEntries(): GuestbookEntry[] {
  return guestbookEntries;
}

export function addGuestbookEntry(name: string, message: string): GuestbookEntry {
  const newEntry: GuestbookEntry = {
    id: Date.now().toString(),
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  guestbookEntries = [newEntry, ...guestbookEntries];
  return newEntry;
}

export function deleteGuestbookEntry(id: string): boolean {
  const index = guestbookEntries.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return false;
  }
  guestbookEntries = guestbookEntries.filter((entry) => entry.id !== id);
  return true;
}

