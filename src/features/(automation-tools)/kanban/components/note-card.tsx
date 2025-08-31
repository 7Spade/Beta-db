"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "@/utils";
import { type Note, NOTE_COLORS } from "@root/src/features/(automation-tools)/kanban/types";
import { Edit3, MoreVertical, Pin, Trash2 } from "lucide-react";
import { useState } from "react";

interface NoteCardProps {
  note: Note;
  onDeleteNote: (noteId: string) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onPinNote: (noteId: string) => void;
}

export const NoteCard = ({ note, onDeleteNote, onUpdateNote, onPinNote }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    onUpdateNote(note.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleColorChange = (color: string) => {
    onUpdateNote(note.id, { color });
  };

  return (
    <Card
      className="w-full max-w-sm transition-all duration-200 hover:shadow-lg cursor-pointer group"
      style={{ backgroundColor: note.color }}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 font-semibold text-sm bg-transparent border-none outline-none"
              placeholder="標題..."
              autoFocus
            />
          ) : (
            <h3 className="font-semibold text-sm line-clamp-2">{note.title}</h3>
          )}

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onPinNote(note.id)}
            >
              <Pin className={cn("h-3 w-3", note.isPinned && "fill-current text-primary")} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-3 w-3" />
                  編輯
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-3 w-3" />
                  刪除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full text-sm bg-transparent border-none outline-none resize-none min-h-[60px]"
            placeholder="內容..."
          />
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
            {note.content}
          </p>
        )}

        {isEditing && (
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all",
                    note.color === color ? "border-primary scale-110" : "border-gray-300"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button size="sm" onClick={handleSave}>
                儲存
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="hidden" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此筆記嗎？</AlertDialogTitle>
            <AlertDialogDescription>此操作無法復原。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteNote(note.id)}>
              繼續刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
