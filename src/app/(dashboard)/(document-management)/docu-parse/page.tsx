import { DocuParseView } from '@/features/(automation-tools)/docu-parse/views/docu-parse-view';
import { Suspense } from 'react';

export default function DocuParsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocuParseView />
    </Suspense>
  );
}
