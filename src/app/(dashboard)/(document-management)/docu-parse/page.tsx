import { DocuParseView } from '@/features/docu-parse/views/docu-parse-view';
import { Suspense } from 'react';

export default function DocuParsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocuParseView />
    </Suspense>
  );
}
