
'use client';

import { NotesGrid } from "@root/src/features/(automation-tools)/kanban/components/notes-grid";
import { QuickNote } from "@root/src/features/(automation-tools)/kanban/components/quick-note";
import { notes as initialNotes } from "@root/src/features/(automation-tools)/kanban/data";
import type { Note } from '@root/src/features/(automation-tools)/kanban/types';
import { useState } from 'react';

export const KanbanView = () => {
    const [notes, setNotes] = useState<Note[]>(initialNotes);

    const addNote = (title: string, content: string, color: string) => {
        const newNote: Note = {
            id: `note-${Date.now()}`,
            title: title || "無標題筆記",
            content: content || "",
            color,
            isPinned: false,
            createdAt: new Date()
        };
        setNotes([newNote, ...notes]);
    };

    const updateNote = (noteId: string, updates: Partial<Note>) => {
        setNotes(notes.map(note =>
            note.id === noteId
                ? { ...note, ...updates }
                : note
        ));
    };

    const deleteNote = (noteId: string) => {
        setNotes(notes.filter(note => note.id !== noteId));
    };

    const pinNote = (noteId: string) => {
        setNotes(notes.map(note =>
            note.id === noteId
                ? { ...note, isPinned: !note.isPinned }
                : note
        ));
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">速記看板</h1>
                <p className="text-muted-foreground">記錄想法、任務和重要資訊，就像 Google Keep 一樣簡單易用。</p>
            </div>

            {/* 快速新增筆記 */}
            <QuickNote onAddNote={addNote} />

            {/* 筆記網格 */}
            <NotesGrid
                notes={notes}
                onDeleteNote={deleteNote}
                onUpdateNote={updateNote}
                onPinNote={pinNote}
            />
        </div>
    );
};
