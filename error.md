PS D:\7Spade\Beta-db> npx tsc --noEmit
.next/types/app/(app)/system-administration/website-cms/blog-management/posts/[id]/edit/page.ts:34:29 - error TS2344: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
Types of property 'params' are incompatible.
Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

34 checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>()
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.next/types/app/(app)/system-administration/website-cms/blog-management/posts/[id]/page.ts:34:29 - error TS2344: Type '{ params: { id: string; }; }' does not satisfy the constraint 'PageProps'.
Types of property 'params' are incompatible.
Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

34 checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>()
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.next/types/app/(public)/blog/[slug]/page.ts:34:29 - error TS2344: Type 'Props' does not satisfy the constraint 'PageProps'.  
 Types of property 'params' are incompatible.
Type '{ slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

34 checkFields<Diff<PageProps, FirstArg<TEntry['default']>, 'default'>>()
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.next/types/app/(public)/blog/[slug]/page.ts:38:31 - error TS2344: Type 'Props' does not satisfy the constraint 'PageProps'.  
 Types of property 'params' are incompatible.
Type '{ slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

38 checkFields<Diff<PageProps, FirstArg<MaybeField<TEntry, 'generateMetadata'>>, 'generateMetadata'>>()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/(system-admin)/website-cms/blog/actions/blog.actions.ts:41:37 - error TS2339: Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'.

41 const sessionCookie = cookies().get('session')?.value;
~~~

src/features/(system-admin)/website-cms/blog/actions/blog.actions.ts:41:37
41 const sessionCookie = cookies().get('session')?.value;
~~~
Did you forget to use 'await'?

src/features/(system-admin)/website-cms/blog/components/BlogEditor/index.tsx:5:25 - error TS2305: Module '"@/ui/textarea"' has no exported member 'TextareaProps'.

5 import { Textarea, type TextareaProps } from '@/ui/textarea';
~~~~~~~~~~~~~

src/features/(system-admin)/website-cms/career/utils/status.utils.ts:2:51 - error TS2307: Cannot find module '../types' or its corresponding type declarations.

2 import type { JobStatus, ApplicationStatus } from '../types';
~~~~~~~~~~

src/features/index.ts:24:15 - error TS2307: Cannot find module '@root/src/features/(system-admin)/website-cms/blog/views/post-form-view' or its corresponding type declarations.

24 export \* from '@root/src/features/(system-admin)/website-cms/blog/views/post-form-view';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/index.ts:25:15 - error TS2307: Cannot find module '@root/src/features/(system-admin)/website-cms/blog/views/posts-list-view' or its corresponding type declarations.

25 export \* from '@root/src/features/(system-admin)/website-cms/blog/views/posts-list-view';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Found 9 errors in 7 files.

Errors Files
1 .next/types/app/(app)/system-administration/website-cms/blog-management/posts/[id]/edit/page.ts:34
1 .next/types/app/(app)/system-administration/website-cms/blog-management/posts/[id]/page.ts:34
2 .next/types/app/(public)/blog/[slug]/page.ts:34
1 src/features/(system-admin)/website-cms/blog/actions/blog.actions.ts:41
1 src/features/(system-admin)/website-cms/blog/components/BlogEditor/index.tsx:5
1 src/features/(system-admin)/website-cms/career/utils/status.utils.ts:2
2 src/features/index.ts:24
