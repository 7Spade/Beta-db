"use client";
import { Input } from "@/ui/input";
import { type Note } from "@root/src/features/automation-tools/kanban/types";
import { Search } from "lucide-react";
import { useState } from "react";
import { NoteCard } from "./note-card";

interface NotesGridProps {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onPinNote: (noteId: string) => void;
}

export const NotesGrid = ({ notes, onDeleteNote, onUpdateNote, onPinNote }: NotesGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 釘選的筆記排在前面
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* 搜尋欄 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜尋筆記..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 筆記網格 */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>沒有找到符合條件的筆記</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDeleteNote={onDeleteNote}
              onUpdateNote={onUpdateNote}
              onPinNote={onPinNote}
            />
          ))}
        </div>
      )}

      {/* 結果統計 */}
      <div className="text-sm text-muted-foreground text-center">
        顯示 {sortedNotes.length} 個筆記，共 {notes.length} 個
      </div>
    </div>
  );
};
