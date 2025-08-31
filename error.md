studio-8713123741:~/studio{main}$ tsc --noEmit
functions/src/genkit-sample.ts:3:24 - error TS2307: Cannot find module '@genkit-ai/vertexai' or its corresponding type declarations.

3 import {vertexAI} from "@genkit-ai/vertexai";

```

functions/src/genkit-sample.ts:7:29 - error TS2307: Cannot find module '@genkit-ai/vertexai' or its corresponding type declarations.

7 import {gemini20Flash} from "@genkit-ai/vertexai";
```

functions/src/genkit-sample.ts:11:30 - error TS2307: Cannot find module 'firebase-functions/https' or its corresponding type declarations.

11 import { onCallGenkit } from "firebase-functions/https";

```

functions/src/genkit-sample.ts:16:30 - error TS2307: Cannot find module 'firebase-functions/params' or its corresponding type declarations.

16 import { defineSecret } from "firebase-functions/params";
```

functions/src/genkit-sample.ts:21:39 - error TS2307: Cannot find module '@genkit-ai/firebase' or its corresponding type declarations.

21 import {enableFirebaseTelemetry} from "@genkit-ai/firebase";

```

functions/src/genkit-sample.ts:69:16 - error TS7006: Parameter 'authData' implicitly has an 'any' type.

69 authPolicy: (authData) => {
~~~~~~~~

functions/src/index.ts:10:32 - error TS2307: Cannot find module 'firebase-functions' or its corresponding type declarations.

10 import {setGlobalOptions} from "firebase-functions";
~~~~~~~~~~~~~~~~~~~~

functions/src/index.ts:11:25 - error TS2307: Cannot find module 'firebase-functions/https' or its corresponding type declarations.

11 import {onRequest} from "firebase-functions/https";
```

functions/src/index.ts:12:25 - error TS2307: Cannot find module 'firebase-functions/logger' or its corresponding type declarations.

12 import \* as logger from "firebase-functions/logger";

```

functions/src/index.ts:30:38 - error TS7006: Parameter 'request' implicitly has an 'any' type.

30 export const helloWorld = onRequest((request, response) => {
~~~~~~~

functions/src/index.ts:30:47 - error TS7006: Parameter 'response' implicitly has an 'any' type.

30 export const helloWorld = onRequest((request, response) => {
~~~~~~~~

src/components/layout/core/app-header.tsx:49:30 - error TS2339: Property 'avatarUrl' does not exist on type 'UserProfile'.

49 avatar: profile?.avatarUrl,
~~~~~~~~~

src/features/(core-operations)/contracts/components/version-timeline.tsx:30:54 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

30 <p className="font-semibold">{formatDate(version.date)}</p>
~~~~~~~~~~~~

src/features/(core-operations)/contracts/dialogs/create-contract-dialog.tsx:64:34 - error TS2345: Argument of type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; }' is not assignable to parameter of type 'Omit<Contract, "id" | "payments" | "changeOrders" | "versions">'.
Property 'receipts' is missing in type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; }' but required in type 'Omit<Contract, "id" | "payments" | "changeOrders" | "versions">'.

64 const success = await onSave(values);
~~~~~~

src/features/(core-operations)/contracts/types/contract.types.ts:25:3
25 receipts: Receipt[];
~~~~~~~~
'receipts' is declared here.

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:26:5 - error TS2322: Type 'Contract' is not assignable to type '{ name?: string | undefined; client?: string | undefined; startDate?: Date | undefined; endDate?: Date | undefined; status?: "啟用中" | "已完成" | "暫停中" | "已終止" | undefined; ... 4 more ...; clientRepresentative?: string | undefined; } | AsyncDefaultValues<...> | undefined'.
Type 'Contract' is not assignable to type '{ name?: string | undefined; client?: string | undefined; startDate?: Date | undefined; endDate?: Date | undefined; status?: "啟用中" | "已完成" | "暫停中" | "已終止" | undefined; scope?: string | undefined; totalValue?: number | undefined; contractor?: string | undefined; customId?: string | undefined; clientRepresentative?: s...'.
Types of property 'startDate' are incompatible.
Type 'Date | Timestamp' is not assignable to type 'Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

26 defaultValues: contract,
~~~~~~~~~~~~~

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:30:16 - error TS2345: Argument of type 'Contract' is not assignable to parameter of type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; } | { ...; } | ResetAction<...> | undefined'.
Type 'Contract' is not assignable to type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; } | { ...; }'.
Type 'Contract' is not assignable to type '{ name?: string | undefined; client?: string | undefined; startDate?: Date | undefined; endDate?: Date | undefined; status?: "啟用中" | "已完成" | "暫停中" | "已終止" | undefined; scope?: string | undefined; totalValue?: number | undefined; contractor?: string | undefined; customId?: string | undefined; clientRepresentative?: s...'.
Types of property 'startDate' are incompatible.
Type 'Date | Timestamp' is not assignable to type 'Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

30 form.reset(contract);
~~~~~~~~

src/features/(core-operations)/contracts/hooks/use-contract-form.ts:33:18 - error TS2345: Argument of type 'Contract' is not assignable to parameter of type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; } | { ...; } | ResetAction<...> | undefined'.
Type 'Contract' is not assignable to type '{ name: string; client: string; startDate: Date; endDate: Date; status: "啟用中" | "已完成" | "暫停中" | "已終止"; scope: string; totalValue: number; contractor: string; customId?: string | undefined; clientRepresentative?: string | undefined; } | { ...; }'.
Type 'Contract' is not assignable to type '{ name?: string | undefined; client?: string | undefined; startDate?: Date | undefined; endDate?: Date | undefined; status?: "啟用中" | "已完成" | "暫停中" | "已終止" | undefined; scope?: string | undefined; totalValue?: number | undefined; contractor?: string | undefined; customId?: string | undefined; clientRepresentative?: s...'.
Types of property 'startDate' are incompatible.
Type 'Date | Timestamp' is not assignable to type 'Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

33 form.reset(contract);
~~~~~~~~

src/features/(core-operations)/contracts/services/export.service.ts:25:20 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

25 formatDate(c.startDate),
~~~~~~~~~~~

src/features/(core-operations)/contracts/services/export.service.ts:26:20 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

26 formatDate(c.endDate),
~~~~~~~~~

src/features/(core-operations)/contracts/tables/change-orders-table.tsx:38:38 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

38 <TableCell>{formatDate(order.date)}</TableCell>
~~~~~~~~~~

src/features/(core-operations)/contracts/tables/contracts-table.tsx:70:20 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

70 formatDate(c.startDate),
~~~~~~~~~~~

src/features/(core-operations)/contracts/tables/contracts-table.tsx:71:20 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

71 formatDate(c.endDate),
~~~~~~~~~

src/features/(core-operations)/contracts/tables/contracts-table.tsx:132:33 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

132 {formatDate(contract.endDate)}
~~~~~~~~~~~~~~~~

src/features/(core-operations)/contracts/tables/payments-table.tsx:38:38 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

38 <TableCell>{formatDate(payment.requestDate)}</TableCell>
~~~~~~~~~~~~~~~~~~~

src/features/(core-operations)/contracts/tables/payments-table.tsx:43:48 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

43 {payment.paidDate ? formatDate(payment.paidDate) : '未付款'}
~~~~~~~~~~~~~~~~

src/features/(core-operations)/projects/actions/acceptance-actions.ts:30:11 - error TS2739: Type '{ status: "草稿"; submittedAt: Date; history: { action: string; userId: string; timestamp: Date; }[]; title: string; projectId: string; projectName: string; applicantId: string; applicantName: string; reviewerId: string; linkedTaskIds: string[]; notes?: string | undefined; }' is missing the following properties from type 'Omit<AcceptanceRecord, "id">': taskId, submittedQuantity

30 const record: Omit<AcceptanceRecord, 'id'> = {
~~~~~~

src/features/(core-operations)/projects/actions/acceptance-actions.ts:67:37 - error TS2339: Property 'get' does not exist on type 'DocumentReference<DocumentData, DocumentData>'.

67 ...((await (await recordRef.get()).data())?.history || []),
~~~

src/features/(core-operations)/projects/actions/acceptance-actions.ts:96:37 - error TS2339: Property 'get' does not exist on type 'DocumentReference<DocumentData, DocumentData>'.

96 ...((await (await recordRef.get()).data())?.history || []),
~~~

src/features/(core-operations)/projects/actions/project.actions.ts:14:37 - error TS2352: Conversion of type 'string' to type 'Date' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

14 startDate: Timestamp.fromDate(project.startDate as Date),
~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/(core-operations)/projects/actions/project.actions.ts:15:35 - error TS2352: Conversion of type 'string' to type 'Date' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.

15 endDate: Timestamp.fromDate(project.endDate as Date),
~~~~~~~~~~~~~~~~~~~~~~~

src/features/(core-operations)/projects/actions/task-actions.ts:57:5 - error TS2353: Object literal may only specify known properties, and 'status' does not exist in type 'Task'.

57 status: '待處理',
~~~~~~

src/features/(core-operations)/projects/components/create-project-dialog.tsx:61:43 - error TS2345: Argument of type '{ title: string; description: string; startDate: Date; endDate: Date; value: number; }' is not assignable to parameter of type 'Omit<Project, "id" | "tasks">'.
Types of property 'startDate' are incompatible.
Type 'Date' is not assignable to type 'string'.

61 const result = await addProjectAction(values);
~~~~~~

src/features/(core-operations)/projects/components/project-details-sheet.tsx:56:28 - error TS2322: Type '{ startDate: Date; endDate: Date; id: string; customId?: string; title: string; description: string; client?: string; clientRepresentative?: string; tasks: Task[]; value: number; }' is not assignable to type 'Project'.
Types of property 'startDate' are incompatible.
Type 'Date' is not assignable to type 'string'.

56 <ProjectHeader project={projectWithDates} />
~~~~~~~

src/features/(core-operations)/projects/components/project-header.tsx:9:3
9 project: Project;
~~~~~~~
The expected type comes from property 'project' which is declared here on type 'IntrinsicAttributes & ProjectHeaderProps'

src/features/(core-operations)/projects/components/project-details-sheet.tsx:57:26 - error TS2322: Type '{ startDate: Date; endDate: Date; id: string; customId?: string; title: string; description: string; client?: string; clientRepresentative?: string; tasks: Task[]; value: number; }' is not assignable to type 'Project'.
Types of property 'startDate' are incompatible.
Type 'Date' is not assignable to type 'string'.

57 <AddTaskForm project={projectWithDates} />
~~~~~~~

src/features/(core-operations)/projects/components/add-task-form.tsx:28:3
28 project: Project;
~~~~~~~
The expected type comes from property 'project' which is declared here on type 'IntrinsicAttributes & AddTaskFormProps'

src/features/(core-operations)/projects/components/project-details-sheet.tsx:58:23 - error TS2322: Type '{ startDate: Date; endDate: Date; id: string; customId?: string; title: string; description: string; client?: string; clientRepresentative?: string; tasks: Task[]; value: number; }' is not assignable to type 'Project'.
Types of property 'startDate' are incompatible.
Type 'Date' is not assignable to type 'string'.

58 <TaskList project={projectWithDates} />
~~~~~~~

src/features/(core-operations)/projects/components/task-list.tsx:8:3
8 project: Project;
~~~~~~~
The expected type comes from property 'project' which is declared here on type 'IntrinsicAttributes & TaskListProps'

src/features/(crm-management)/contracts/contracts-tab.tsx:86:44 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

86 <TableCell>{formatDate(contract.startDate)}</TableCell>
~~~~~~~~~~~~~~~~~~

src/features/(crm-management)/contracts/contracts-tab.tsx:87:44 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

87 <TableCell>{formatDate(contract.endDate)}</TableCell>
~~~~~~~~~~~~~~~~

src/features/auth/auth-actions.ts:15:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

15 return (
~~~~~~

src/features/blog/views/post-form-view.tsx:85:25 - error TS2353: Object literal may only specify known properties, and 'createdAt' does not exist in type '{ title: string; content: string; status: "草稿" | "已發布" | "已封存"; slug: string; excerpt?: string | undefined; imageUrl?: string | undefined; } | { title?: string | undefined; content?: string | undefined; status?: "草稿" | ... 2 more ... | undefined; slug?: string | undefined; excerpt?: string | undefined; imageUrl?: st...'.

85 createdAt: (data.createdAt as Timestamp)?.toDate(),
~~~~~~~~~

src/features/docu-parse/actions/docu-parse-commit.actions.ts:26:3 - error TS2322: Type '{ id: string; title: string; status: string; lastUpdated: string; quantity: number; unitPrice: number; value: number; subTasks: never[]; }[]' is not assignable to type 'Task[]'.
Property 'completedQuantity' is missing in type '{ id: string; title: string; status: string; lastUpdated: string; quantity: number; unitPrice: number; value: number; subTasks: never[]; }' but required in type 'Task'.

26 return items.map((item, index) => ({
~~~~~~

src/lib/types/types.ts:189:3
189 completedQuantity: number; // New field, replaces status
~~~~~~~~~~~~~~~~~
'completedQuantity' is declared here.

src/lib/types/errors.ts:28:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

28 return error && typeof error === 'object' && 'code' in error && 'message' in error;
~~~~~~

src/lib/types/errors.ts:32:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

32 return error && typeof error === 'object' && 'error' in error && 'code' in error;
~~~~~~

src/lib/types/errors.ts:36:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

36 return error && typeof error === 'object' && 'message' in error;
~~~~~~

src/lib/utils/date-utils.ts:46:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

46 return value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function';
~~~~~~

Found 44 errors in 22 files.

Errors Files
6 functions/src/genkit-sample.ts:3
5 functions/src/index.ts:10
1 src/components/layout/core/app-header.tsx:49
1 src/features/(core-operations)/contracts/components/version-timeline.tsx:30
1 src/features/(core-operations)/contracts/dialogs/create-contract-dialog.tsx:64
2 src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:26
1 src/features/(core-operations)/contracts/hooks/use-contract-form.ts:33
2 src/features/(core-operations)/contracts/services/export.service.ts:25
1 src/features/(core-operations)/contracts/tables/change-orders-table.tsx:38
3 src/features/(core-operations)/contracts/tables/contracts-table.tsx:70
2 src/features/(core-operations)/contracts/tables/payments-table.tsx:38
3 src/features/(core-operations)/projects/actions/acceptance-actions.ts:30
2 src/features/(core-operations)/projects/actions/project.actions.ts:14
1 src/features/(core-operations)/projects/actions/task-actions.ts:57
1 src/features/(core-operations)/projects/components/create-project-dialog.tsx:61
3 src/features/(core-operations)/projects/components/project-details-sheet.tsx:56
2 src/features/(crm-management)/contracts/contracts-tab.tsx:86
1 src/features/auth/auth-actions.ts:15
1 src/features/blog/views/post-form-view.tsx:85
1 src/features/docu-parse/actions/docu-parse-commit.actions.ts:26
3 src/lib/types/errors.ts:28
1 src/lib/utils/date-utils.ts:46
```
