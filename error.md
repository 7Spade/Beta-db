PS D:\7Spade\Beta-db> npx tsc --noEmit
functions/src/genkit-sample.ts:11:29 - error TS2459: Module '"firebase-functions/https"' declares 'AuthData' locally, but it is not exported.

11 import { onCallGenkit, type AuthData } from 'firebase-functions/https';
                               ~~~~~~~~

  functions/node_modules/firebase-functions/lib/v2/providers/https.d.ts:3:86
    3 import { CallableRequest, CallableResponse, FunctionsErrorCode, HttpsError, Request, AuthData } from "../../common/providers/https";
                                                                                           ~~~~~~~~
    'AuthData' is declared here.

src/components/layout/core/app-header.tsx:49:30 - error TS2339: Property 'avatarUrl' does not exist on type 'UserProfile'.

49             avatar: profile?.avatarUrl,
                                ~~~~~~~~~

src/features/(core-operations)/contracts/components/version-timeline.tsx:31:61 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

31             <p className="font-semibold">{formatDate(toDate(version.date))}</p>
                                                               ~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:29:25 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.    
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

29       startDate: toDate(contract.startDate),
                           ~~~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:30:23 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.    
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

30       endDate: toDate(contract.endDate),
                         ~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:37:25 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.    
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

37       startDate: toDate(contract.startDate),
                           ~~~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:38:23 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.    
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

38       endDate: toDate(contract.endDate),
                         ~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/hooks/use-contract-form.ts:36:27 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

36         startDate: toDate(contract.startDate),
                             ~~~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/hooks/use-contract-form.ts:37:25 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

37         endDate: toDate(contract.endDate),
                           ~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/services/export.service.ts:26:27 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

26         formatDate(toDate(c.startDate)),
                             ~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/services/export.service.ts:27:27 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

27         formatDate(toDate(c.endDate)),
                             ~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/change-orders-table.tsx:39:45 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.  
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

39               <TableCell>{formatDate(toDate(order.date))}</TableCell>
                                               ~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/contracts-table.tsx:71:27 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

71         formatDate(toDate(c.startDate)),
                             ~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/contracts-table.tsx:72:27 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.      
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

72         formatDate(toDate(c.endDate)),
                             ~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/contracts-table.tsx:133:40 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.     
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

133                     {formatDate(toDate(contract.endDate))}
                                           ~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/payments-table.tsx:39:45 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.       
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

39               <TableCell>{formatDate(toDate(payment.requestDate))}</TableCell>
                                               ~~~~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/tables/payments-table.tsx:45:39 - error TS2345: Argument of type 'Date | FirebaseFirestore.Timestamp' is not assignable to parameter of type 'Date | import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.       
  Type 'Timestamp' is not assignable to type 'Date | Timestamp'.
    Property 'toJSON' is missing in type 'FirebaseFirestore.Timestamp' but required in type 'import("D:/7Spade/Beta-db/node_modules/@firebase/firestore/dist/index").Timestamp'.

45                   ? formatDate(toDate(payment.paidDate))
                                         ~~~~~~~~~~~~~~~~

  node_modules/@firebase/firestore/dist/index.d.ts:2647:5
    2647     toJSON(): {
             ~~~~~~
    'toJSON' is declared here.

src/features/(core-operations)/contracts/views/contracts-view.tsx:53:11 - error TS2322: Type '(data: Omit<Contract, "id" | "payments" | "changeOrders" | "versions">) => Promise<boolean>' is not assignable to type '(data: Omit<Contract, "id" | "versions" | "payments" | "receipts" | "changeOrders">) => Promise<boolean>'.
  Types of parameters 'data' and 'data' are incompatible.
    Property 'receipts' is missing in type 'Omit<Contract, "id" | "versions" | "payments" | "receipts" | "changeOrders">' but required in type 'Omit<Contract, "id" | "versions" | "payments" | "changeOrders">'.

53           onSave={handleAddContract}
             ~~~~~~

  src/features/(core-operations)/contracts/types/contract.types.ts:25:3
    25   receipts: Receipt[];
         ~~~~~~~~
    'receipts' is declared here.
  src/features/(core-operations)/contracts/dialogs/create-contract-dialog.tsx:25:3
    25   onSave: (
         ~~~~~~
    The expected type comes from property 'onSave' which is declared here on type 'IntrinsicAttributes & CreateContractDialogProps'

src/features/(core-operations)/contracts/views/create-contract-view.tsx:46:7 - error TS2322: Type '(data: Omit<Contract, "id" | "payments" | "changeOrders" | "versions">) => Promise<boolean>' is not assignable to type '(data: Omit<Contract, "id" | "versions" | "payments" | "receipts" | "changeOrders">) => Promise<boolean>'.
  Types of parameters 'data' and 'data' are incompatible.
    Property 'receipts' is missing in type 'Omit<Contract, "id" | "versions" | "payments" | "receipts" | "changeOrders">' but required in type 'Omit<Contract, "id" | "versions" | "payments" | "changeOrders">'.

46       onSave={handleSave}
         ~~~~~~

  src/features/(core-operations)/contracts/types/contract.types.ts:25:3
    25   receipts: Receipt[];
         ~~~~~~~~
    'receipts' is declared here.
  src/features/(core-operations)/contracts/dialogs/create-contract-dialog.tsx:25:3
    25   onSave: (
         ~~~~~~
    The expected type comes from property 'onSave' which is declared here on type 'IntrinsicAttributes & CreateContractDialogProps'

src/features/(core-operations)/projects/components/ProjectDetailsDialog.tsx:81:14 - error TS2739: Type '{ project: { startDate: Date; endDate: Date; id: string; customId?: string | undefined; title: string; description: string; client?: string | undefined; clientRepresentative?: string | undefined; tasks: Task[]; value: number; }; onAddSubtask: (parentTaskId: string, taskTitle: string, quantity: number, unitPrice: num...' is missing the following properties from type 'TaskListProps': expandedTasks, onToggleExpand

81             <TaskList
                ~~~~~~~~

src/features/(crm-management)/contracts/contracts-tab.tsx:113:44 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
  Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
    Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

113                     <TableCell>{formatDate(contract.startDate)}</TableCell>
                                               ~~~~~~~~~~~~~~~~~~

src/features/(crm-management)/contracts/contracts-tab.tsx:114:44 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
  Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
    Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 37 more.

114                     <TableCell>{formatDate(contract.endDate)}</TableCell>
                                               ~~~~~~~~~~~~~~~~

src/features/(crm-management)/workflows/workflow-builder.tsx:150:99 - error TS2345: Argument of type 'Date | Timestamp' is not assignable to parameter of type 'string | Date | undefined'.
  Type 'Timestamp' is not assignable to type 'string | Date | undefined'.
    Type 'Timestamp' is missing the following properties from type 'Date': toDateString, toTimeString, toLocaleDateString, toLocaleTimeString, and 36 more.

150                                     <p className="text-xs text-muted-foreground">到期日: {formatDate(doc.dueDate)}</p>
                                                                                                      ~~~~~~~~~~~

src/features/(system-admin)/(security-compliance)/auth/auth-actions.ts:15:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

15   return (
     ~~~~~~

src/features/(system-admin)/website-cms/blog/views/post-form-view.tsx:85:25 - error TS2353: Object literal may only specify known properties, and 'createdAt' does not exist in type '{ title: string; status: "草稿" | "已發布" | "已封存"; content: string; slug: string; excerpt?: string | undefined; imageUrl?: string | undefined; } | { title?: string | undefined; status?: "草稿" | "已發布" | "已封存" | undefined; content?: string | undefined; slug?: string | undefined; excerpt?: string | undefined; imageUrl?: str...'.

85                         createdAt: (data.createdAt as Timestamp)?.toDate(),
                           ~~~~~~~~~

src/lib/types/errors.ts:28:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

28   return error && typeof error === 'object' && 'code' in error && 'message' in error;
     ~~~~~~

src/lib/types/errors.ts:32:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

32   return error && typeof error === 'object' && 'error' in error && 'code' in error;
     ~~~~~~

src/lib/types/errors.ts:36:3 - error TS2322: Type 'unknown' is not assignable to type 'boolean'.

36   return error && typeof error === 'object' && 'message' in error;
     ~~~~~~


Found 28 errors in 17 files.

Errors  Files
     1  functions/src/genkit-sample.ts:11
     1  src/components/layout/core/app-header.tsx:49
     1  src/features/(core-operations)/contracts/components/version-timeline.tsx:31
     4  src/features/(core-operations)/contracts/forms/edit-contract-form.tsx:29
     2  src/features/(core-operations)/contracts/hooks/use-contract-form.ts:36
     2  src/features/(core-operations)/contracts/services/export.service.ts:26
     1  src/features/(core-operations)/contracts/tables/change-orders-table.tsx:39
     3  src/features/(core-operations)/contracts/tables/contracts-table.tsx:71
     2  src/features/(core-operations)/contracts/tables/payments-table.tsx:39
     1  src/features/(core-operations)/contracts/views/contracts-view.tsx:53
     1  src/features/(core-operations)/contracts/views/create-contract-view.tsx:46
     1  src/features/(core-operations)/projects/components/ProjectDetailsDialog.tsx:81
     2  src/features/(crm-management)/contracts/contracts-tab.tsx:113
     1  src/features/(crm-management)/workflows/workflow-builder.tsx:150
     1  src/features/(system-admin)/(security-compliance)/auth/auth-actions.ts:15
     1  src/features/(system-admin)/website-cms/blog/views/post-form-view.tsx:85
     3  src/lib/types/errors.ts:28
PS D:\7Spade\Beta-db> 