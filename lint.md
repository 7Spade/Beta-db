PS D:\7Spade\Beta-db> npm run lint

> nextn@0.1.0 lint
> next lint


./src/app/(admin)/career-management/page.tsx
2:10  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/(admin)/contact-management/page.tsx
2:10  Warning: 'Mail' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/(admin)/content-management/media/page.tsx
4:10  Warning: 'Cloud' is defined but never used.  @typescript-eslint/no-unused-vars
49:16  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text
87:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/app/(admin)/content-management/page.tsx
1:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/(auth)/profile/[id]/page.tsx
5:1  Warning: Prevent Client Components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component  @next/next/no-async-client-component

./src/app/(dashboard)/projects/page.tsx
11:43  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/app/(public)/about/page.tsx
1:29  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
3:10  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
21:16  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
45:16  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/app/(public)/blog/page.tsx
3:16  Warning: 'CardContent' is defined but never used.  @typescript-eslint/no-unused-vars
3:46  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
51:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/app/(public)/blog/[slug]/page.tsx
1:16  Warning: 'CardContent' is defined but never used.  @typescript-eslint/no-unused-vars
1:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars
1:46  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
1:58  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
3:20  Warning: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
25:11  Warning: 'slug' is assigned a value but never used.  @typescript-eslint/no-unused-vars
54:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/app/(public)/careers/page.tsx
3:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/(public)/privacy-policy/page.tsx
1:29  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
1:41  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars

./src/app/(public)/terms-of-service/page.tsx
1:29  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
1:41  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/admin/views/user-management-view.tsx
33:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/app/actions/project-actions.ts
6:57  Warning: 'writeBatch' is defined but never used.  @typescript-eslint/no-unused-vars
11:11  Warning: 'newProjectRef' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/features/app/project-details-sheet.tsx
4:17  Warning: 'useMemo' is defined but never used.  @typescript-eslint/no-unused-vars
92:9  Warning: 'findProjectAndTasks' is assigned a value but never used.  @typescript-eslint/no-unused-vars
92:32  Warning: 'projectId' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/auth/auth-actions.ts
6:3  Warning: 'createUserWithEmailAndPassword' is defined but never used.  @typescript-eslint/no-unused-vars
10:28  Warning: 'RegisterValues' is defined but never used.  @typescript-eslint/no-unused-vars
27:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/auth/login-view.tsx
29:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
42:13  Warning: 'userCredential' is assigned a value but never used.  @typescript-eslint/no-unused-vars
51:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
127:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/auth/pending-approval-view.tsx
23:14  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/auth/register-view.tsx
62:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/auth/social-auth-buttons.tsx
54:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/auth/use-auth.ts
62:16  Warning: 'e' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/auth/verify-email-view.tsx
25:14  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/blog/views/post-form-view.tsx
80:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/cloud-drive/actions/storage-actions.ts
76:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
92:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
92:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
110:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
110:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
132:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
132:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
147:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
173:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/cloud-drive/components/file-card.tsx
55:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/components/features/cloud-drive/views/cloud-drive-view.tsx
12:91  Warning: 'BreadcrumbPage' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/contracts/actions/contract-actions.ts
87:207  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/actions/types.ts
6:15  Warning: 'WorkItem' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/contracts/dashboard/dashboard.tsx
18:10  Warning: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
18:20  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
19:10  Warning: 'collection' is defined but never used.  @typescript-eslint/no-unused-vars
19:22  Warning: 'onSnapshot' is defined but never used.  @typescript-eslint/no-unused-vars
20:10  Warning: 'firestore' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/contracts/forms/contract-form.tsx
7:10  Warning: 'Form' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/contracts/forms/create-contract-form.tsx
13:20  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/forms/edit-contract-form.tsx
16:20  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/hooks/use-contracts.ts
11:40  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
18:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:47  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
27:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/services/contract.service.ts
36:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/sheets/contract-details-sheet.tsx
34:9  Warning: 'getStatusVariant' is assigned a value but never used.  @typescript-eslint/no-unused-vars
164:85  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
196:84  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/contracts/views/contract-detail-view.tsx
19:40  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
26:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
31:47  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
35:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/dashboard/ai-usage-log.tsx
49:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
76:12  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/docu-parse/components/file-selector.tsx
10:91  Warning: 'BreadcrumbPage' is defined but never used.  @typescript-eslint/no-unused-vars
47:81  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
100:106  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
108:97  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/docu-parse/utils/export.utils.ts
37:51  Warning: 'total' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/docu-parse/views/docu-parse-view.tsx
38:39  Warning: 'Info' is defined but never used.  @typescript-eslint/no-unused-vars
39:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/kanban/components/kanban-board.tsx
3:28  Warning: 'useMemo' is defined but never used.  @typescript-eslint/no-unused-vars
6:8  Warning: 'DragEndEvent' is defined but never used.  @typescript-eslint/no-unused-vars
7:8  Warning: 'DragOverEvent' is defined but never used.  @typescript-eslint/no-unused-vars
9:8  Warning: 'DragStartEvent' is defined but never used.  @typescript-eslint/no-unused-vars
10:3  Warning: 'useSensor' is defined but never used.  @typescript-eslint/no-unused-vars
11:3  Warning: 'useSensors' is defined but never used.  @typescript-eslint/no-unused-vars
12:3  Warning: 'KeyboardSensor' is defined but never used.  @typescript-eslint/no-unused-vars
13:3  Warning: 'Announcements' is defined but never used.  @typescript-eslint/no-unused-vars
14:3  Warning: 'UniqueIdentifier' is defined but never used.  @typescript-eslint/no-unused-vars
15:3  Warning: 'TouchSensor' is defined but never used.  @typescript-eslint/no-unused-vars
16:3  Warning: 'MouseSensor' is defined but never used.  @typescript-eslint/no-unused-vars
18:27  Warning: 'arrayMove' is defined but never used.  @typescript-eslint/no-unused-vars
19:27  Warning: 'KanbanCardProps' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/kanban/components/kanban-card.tsx
9:38  Warning: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
10:10  Warning: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/kanban/components/kanban-column.tsx
10:30  Warning: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/kanban/hooks/use-kanban.ts
5:3  Warning: 'DndContext' is defined but never used.  @typescript-eslint/no-unused-vars
8:3  Warning: 'DragOverlay' is defined but never used.  @typescript-eslint/no-unused-vars
13:3  Warning: 'Announcements' is defined but never used.  @typescript-eslint/no-unused-vars
14:3  Warning: 'UniqueIdentifier' is defined but never used.  @typescript-eslint/no-unused-vars
18:10  Warning: 'SortableContext' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/dashboard/dashboard.tsx
33:11  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/partners/forms/partner-form.tsx
9:24  Warning: 'PartnerFlowType' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/partners/partner-profile.tsx
4:10  Warning: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
4:29  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
5:8  Warning: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
6:33  Warning: 'Contract' is defined but never used.  @typescript-eslint/no-unused-vars
9:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
9:16  Warning: 'CardContent' is defined but never used.  @typescript-eslint/no-unused-vars
9:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars
9:46  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
9:58  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
11:10  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
11:17  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
11:42  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:58  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:81  Warning: 'FileWarning' is defined but never used.  @typescript-eslint/no-unused-vars
11:94  Warning: 'FileX' is defined but never used.  @typescript-eslint/no-unused-vars
11:112  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:118  Warning: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
11:137  Warning: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
11:151  Warning: 'Loader2' is defined but never used.  @typescript-eslint/no-unused-vars
12:10  Warning: 'DropdownMenu' is defined but never used.  @typescript-eslint/no-unused-vars
12:24  Warning: 'DropdownMenuContent' is defined but never used.  @typescript-eslint/no-unused-vars
12:45  Warning: 'DropdownMenuItem' is defined but never used.  @typescript-eslint/no-unused-vars
12:63  Warning: 'DropdownMenuTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
13:10  Warning: 'AlertDialog' is defined but never used.  @typescript-eslint/no-unused-vars
13:23  Warning: 'AlertDialogAction' is defined but never used.  @typescript-eslint/no-unused-vars
13:42  Warning: 'AlertDialogCancel' is defined but never used.  @typescript-eslint/no-unused-vars
13:61  Warning: 'AlertDialogContent' is defined but never used.  @typescript-eslint/no-unused-vars
13:81  Warning: 'AlertDialogDescription' is defined but never used.  @typescript-eslint/no-unused-vars
13:105  Warning: 'AlertDialogFooter' is defined but never used.  @typescript-eslint/no-unused-vars
13:124  Warning: 'AlertDialogHeader' is defined but never used.  @typescript-eslint/no-unused-vars
13:143  Warning: 'AlertDialogTitle' is defined but never used.  @typescript-eslint/no-unused-vars
13:161  Warning: 'AlertDialogTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
14:10  Warning: 'firestore' is defined but never used.  @typescript-eslint/no-unused-vars
15:10  Warning: 'collection' is defined but never used.  @typescript-eslint/no-unused-vars
15:22  Warning: 'query' is defined but never used.  @typescript-eslint/no-unused-vars
15:29  Warning: 'where' is defined but never used.  @typescript-eslint/no-unused-vars
15:36  Warning: 'getDocs' is defined but never used.  @typescript-eslint/no-unused-vars
15:45  Warning: 'Timestamp' is defined but never used.  @typescript-eslint/no-unused-vars
16:10  Warning: 'formatDate' is defined but never used.  @typescript-eslint/no-unused-vars
17:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/partners/partners-view.tsx
25:20  Warning: 'setUserRole' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/partners/profile/partner-profile.tsx
4:10  Warning: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
4:29  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
5:8  Warning: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
6:33  Warning: 'Contract' is defined but never used.  @typescript-eslint/no-unused-vars
9:10  Warning: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
9:16  Warning: 'CardContent' is defined but never used.  @typescript-eslint/no-unused-vars
9:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars
9:46  Warning: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
9:58  Warning: 'CardTitle' is defined but never used.  @typescript-eslint/no-unused-vars
11:10  Warning: 'Globe' is defined but never used.  @typescript-eslint/no-unused-vars
11:17  Warning: 'Edit' is defined but never used.  @typescript-eslint/no-unused-vars
11:42  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
11:58  Warning: 'FileText' is defined but never used.  @typescript-eslint/no-unused-vars
11:81  Warning: 'FileWarning' is defined but never used.  @typescript-eslint/no-unused-vars
11:94  Warning: 'FileX' is defined but never used.  @typescript-eslint/no-unused-vars
11:112  Warning: 'Plus' is defined but never used.  @typescript-eslint/no-unused-vars
11:118  Warning: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
11:137  Warning: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
11:151  Warning: 'Loader2' is defined but never used.  @typescript-eslint/no-unused-vars
12:10  Warning: 'DropdownMenu' is defined but never used.  @typescript-eslint/no-unused-vars
12:24  Warning: 'DropdownMenuContent' is defined but never used.  @typescript-eslint/no-unused-vars
12:45  Warning: 'DropdownMenuItem' is defined but never used.  @typescript-eslint/no-unused-vars
12:63  Warning: 'DropdownMenuTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
13:10  Warning: 'AlertDialog' is defined but never used.  @typescript-eslint/no-unused-vars
13:23  Warning: 'AlertDialogAction' is defined but never used.  @typescript-eslint/no-unused-vars
13:42  Warning: 'AlertDialogCancel' is defined but never used.  @typescript-eslint/no-unused-vars
13:61  Warning: 'AlertDialogContent' is defined but never used.  @typescript-eslint/no-unused-vars
13:81  Warning: 'AlertDialogDescription' is defined but never used.  @typescript-eslint/no-unused-vars
13:105  Warning: 'AlertDialogFooter' is defined but never used.  @typescript-eslint/no-unused-vars
13:124  Warning: 'AlertDialogHeader' is defined but never used.  @typescript-eslint/no-unused-vars
13:143  Warning: 'AlertDialogTitle' is defined but never used.  @typescript-eslint/no-unused-vars
13:161  Warning: 'AlertDialogTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
14:10  Warning: 'firestore' is defined but never used.  @typescript-eslint/no-unused-vars
15:10  Warning: 'collection' is defined but never used.  @typescript-eslint/no-unused-vars
15:22  Warning: 'query' is defined but never used.  @typescript-eslint/no-unused-vars
15:29  Warning: 'where' is defined but never used.  @typescript-eslint/no-unused-vars
15:36  Warning: 'getDocs' is defined but never used.  @typescript-eslint/no-unused-vars
15:45  Warning: 'Timestamp' is defined but never used.  @typescript-eslint/no-unused-vars
16:10  Warning: 'formatDate' is defined but never used.  @typescript-eslint/no-unused-vars
17:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/partnerverse/workflows/workflow-builder.tsx
5:29  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars
6:10  Warning: 'Tabs' is defined but never used.  @typescript-eslint/no-unused-vars
6:16  Warning: 'TabsContent' is defined but never used.  @typescript-eslint/no-unused-vars
6:29  Warning: 'TabsList' is defined but never used.  @typescript-eslint/no-unused-vars
6:39  Warning: 'TabsTrigger' is defined but never used.  @typescript-eslint/no-unused-vars
10:74  Warning: 'DialogDescription' is defined but never used.  @typescript-eslint/no-unused-vars
14:10  Warning: 'ArrowLeftRight' is defined but never used.  @typescript-eslint/no-unused-vars
14:38  Warning: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
14:44  Warning: 'Trash2' is defined but never used.  @typescript-eslint/no-unused-vars
14:85  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
14:98  Warning: 'GripVertical' is defined but never used.  @typescript-eslint/no-unused-vars
14:112  Warning: 'Wand2' is defined but never used.  @typescript-eslint/no-unused-vars
17:44  Warning: 'setDoc' is defined but never used.  @typescript-eslint/no-unused-vars
124:18  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/profile/public-profile-view.tsx
23:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/settings/settings-view.tsx
5:10  Warning: 'Button' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/features/storage-manager/components/storage-item-card.tsx
6:67  Warning: 'ExternalLink' is defined but never used.  @typescript-eslint/no-unused-vars
8:41  Warning: 'CardDescription' is defined but never used.  @typescript-eslint/no-unused-vars
11:23  Warning: 'formatDate' is defined but never used.  @typescript-eslint/no-unused-vars
25:10  Warning: 'isUrlLoading' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/components/features/team/knowledge-base/actions/knowledge-actions.ts
68:31  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/features/team/knowledge-base/actions/types.ts
5:15  Warning: 'KnowledgeBaseEntry' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/layout/core/app-header.tsx
50:40  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/components/layout/navigation/breadcrumb.tsx
68:34  Warning: 'index' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/layout/navigation/search-command.tsx
4:18  Warning: 'Command' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/layout/navigation/user-menu.tsx
48:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/components/layout/responsive/mobile-menu.tsx
9:3  Warning: 'SheetHeader' is defined but never used.  @typescript-eslint/no-unused-vars

./src/components/layout/responsive/responsive-wrapper.tsx
16:27  Warning: 'breakpoint' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./src/config/navigation.config.ts
23:5  Warning: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
43:5  Warning: 'FolderGit2' is defined but never used.  @typescript-eslint/no-unused-vars

./src/hooks/use-notifications.ts
34:31  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/hooks/use-toast.ts
21:7  Warning: 'actionTypes' is assigned a value but only used as a type.  @typescript-eslint/no-unused-vars

./src/lib/db/firebase-admin/firebase-admin.ts
24:28  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
63:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
89:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
96:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
96:54  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
96:65  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
120:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
149:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/db/mongoose/mongodb.ts
10:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
13:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/db/supabase/middleware.ts
22:46  Warning: 'options' is defined but never used.  @typescript-eslint/no-unused-vars

./src/lib/events/event-dispatcher.ts
6:45  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
12:27  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
22:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
25:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/services/contracts/firebase-contract.service.ts
27:93  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
41:40  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
47:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
52:53  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
56:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
77:36  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
83:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
88:53  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
92:44  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
107:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./src/lib/types/env.types.ts
51:3  Error: ES2015 module syntax is preferred over namespaces.  @typescript-eslint/no-namespace
52:15  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type

./src/lib/types/types.ts
169:14  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
170:14  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
