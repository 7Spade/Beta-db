import { type Note, NOTE_COLORS } from "@/kanban/types";

export const notes: Note[] = [
  {
    id: "note-1",
    title: "專案會議重點",
    content: "討論新功能的開發時程\n需要與設計團隊協調",
    color: NOTE_COLORS[6],
    isPinned: true,
    createdAt: new Date("2025-01-20")
  },
  {
    id: "note-2",
    title: "週末購物清單",
    content: "牛奶\n麵包\n雞蛋\n水果",
    color: NOTE_COLORS[8],
    isPinned: false,
    createdAt: new Date("2025-01-21")
  },
  {
    id: "note-3",
    title: "新功能想法",
    content: "可以加入拖拽排序功能\n支援標籤分類",
    color: NOTE_COLORS[3],
    isPinned: true,
    createdAt: new Date("2025-01-19")
  },
  {
    id: "note-4",
    title: "讀書筆記",
    content: "《原子習慣》\n- 小改變帶來大結果\n- 習慣堆疊的重要性",
    color: NOTE_COLORS[4],
    isPinned: false,
    createdAt: new Date("2025-01-18")
  }
];
