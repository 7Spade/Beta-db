// This would be a more complex component, potentially wrapping a library like Tiptap or BlockNote.
// For this example, we'll keep it as a simple Textarea.
'use client';

import { Textarea } from '@/ui/textarea';
import * as React from 'react';

export const BlogEditor = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        rows={20}
        placeholder="在此輸入您的文章內容，支援 Markdown 格式..."
        {...props}
      />
    );
  }
);

BlogEditor.displayName = 'BlogEditor';
