"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Plus } from "lucide-react";
import { NOTE_COLORS } from "@/kanban/types";

interface QuickNoteProps {
  onAddNote: (title: string, content: string, color: string) => void;
}

export const QuickNote = ({ onAddNote }: QuickNoteProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleSubmit = () => {
    if (title.trim() || content.trim()) {
      onAddNote(title.trim(), content.trim(), selectedColor);
      setTitle("");
      setContent("");
      setSelectedColor("#ffffff");
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 shadow-sm">
      <CardContent className="p-4">
        {!isExpanded ? (
          <div 
            className="flex items-center gap-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">新增筆記...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="標題"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none shadow-none text-base font-medium p-0 h-auto"
                  onKeyDown={handleKeyDown}
                />
                <textarea
                  placeholder="開始輸入..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border-none shadow-none resize-none min-h-[80px] p-0 text-sm bg-transparent outline-none"
                  onKeyDown={handleKeyDown}
                />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(false)}
              >
                <Plus className="h-4 w-4 rotate-45" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedColor === color ? "border-primary scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <Button onClick={handleSubmit} size="sm">
                儲存
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
