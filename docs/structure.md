```
src/
├── ai
│   ├── README.md
│   ├── dev.ts
│   ├── flows
│   │   ├── extract-work-items-flow.ts
│   │   ├── generate-knowledge-entry-flow.ts
│   │   ├── generate-skill-flow.ts
│   │   └── generate-subtasks-flow.ts
│   └── genkit.ts
├── app
│   ├── (admin)
│   │   ├── blog-management
│   │   │   ├── posts
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   ├── career-management
│   │   │   ├── applications
│   │   │   │   └── page.tsx
│   │   │   ├── jobs
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── contact-management
│   │   │   └── page.tsx
│   │   ├── content-management
│   │   │   ├── media
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── pages
│   │   │       └── page.tsx
│   │   ├── dashboard-management
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── system-management
│   │   │   └── page.tsx
│   │   └── user-management
│   │       └── page.tsx
│   ├── (auth)
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── pending-approval
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── reset-password
│   │   │   └── page.tsx
│   │   └── verify-email
│   │       └── page.tsx
│   ├── (dashboard)
│   │   ├── README.md
│   │   ├── cloud-drive
│   │   │   └── page.tsx
│   │   ├── contracts
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── docu-parse
│   │   │   └── page.tsx
│   │   ├── kanban
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── partnerverse
│   │   │   ├── partners
│   │   │   │   └── page.tsx
│   │   │   └── workflows
│   │   │       └── page.tsx
│   │   ├── projects
│   │   │   └── page.tsx
│   │   ├── quick-actions
│   │   │   ├── daily-report
│   │   │   │   └── page.tsx
│   │   │   ├── project-progress
│   │   │   │   └── page.tsx
│   │   │   └── staff-attendance
│   │   │       └── page.tsx
│   │   ├── settings
│   │   │   └── page.tsx
│   │   └── team
│   │       ├── knowledge-base
│   │       │   └── page.tsx
│   │       ├── members
│   │       │   └── page.tsx
│   │       ├── schedule
│   │       │   └── page.tsx
│   │       └── skills
│   │           └── page.tsx
│   ├── (public)
│   │   ├── README.md
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── blog
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── careers
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── privacy-policy
│   │   │   └── page.tsx
│   │   └── terms-of-service
│   │       └── page.tsx
│   ├── README.md
│   ├── error.tsx
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── README.md
│   ├── features
│   │   ├── README.md
│   │   ├── admin
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── user-actions.ts
│   │   │   └── views
│   │   │       ├── admin-dashboard-view.tsx
│   │   │       └── user-management-view.tsx
│   │   ├── auth
│   │   │   ├── README.md
│   │   │   ├── auth-actions.ts
│   │   │   ├── auth-form-schemas.ts
│   │   │   ├── auth-provider.tsx
│   │   │   ├── auth.config.ts
│   │   │   ├── auth.utils.ts
│   │   │   ├── index.ts
│   │   │   ├── login-view.tsx
│   │   │   ├── pending-approval-view.tsx
│   │   │   ├── register-view.tsx
│   │   │   ├── social-auth-buttons.tsx
│   │   │   ├── use-auth.ts
│   │   │   └── verify-email-view.tsx
│   │   ├── blog
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── posts.actions.ts
│   │   │   └── views
│   │   │       ├── post-form-view.tsx
│   │   │       └── posts-list-view.tsx
│   │   ├── cloud-drive
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── storage-actions.ts
│   │   │   ├── components
│   │   │   │   ├── file-browser.tsx
│   │   │   │   ├── file-card.tsx
│   │   │   │   ├── folder-card.tsx
│   │   │   │   └── upload-button.tsx
│   │   │   ├── types
│   │   │   │   └── storage.types.ts
│   │   │   ├── utils
│   │   │   │   └── path.utils.ts
│   │   │   └── views
│   │   │       └── cloud-drive-view.tsx
│   │   ├── contracts
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   ├── MIGRATION.md
│   │   │   │   ├── README.md
│   │   │   │   ├── contract-actions.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── components
│   │   │   │   ├── change-order-item.tsx
│   │   │   │   ├── contract-status-badge.tsx
│   │   │   │   ├── contract-summary-card.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── payment-progress.tsx
│   │   │   │   └── version-timeline.tsx
│   │   │   ├── constants
│   │   │   │   ├── contract.constants.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── ui.constants.ts
│   │   │   ├── dashboard
│   │   │   │   ├── contract-charts.tsx
│   │   │   │   ├── contract-dashboard.tsx
│   │   │   │   ├── contract-stats.tsx
│   │   │   │   ├── dashboard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── dialogs
│   │   │   │   ├── create-contract-dialog.tsx
│   │   │   │   ├── delete-contract-dialog.tsx
│   │   │   │   ├── edit-contract-dialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── forms
│   │   │   │   ├── contract-form.tsx
│   │   │   │   ├── create-contract-form.tsx
│   │   │   │   ├── edit-contract-form.tsx
│   │   │   │   ├── form-schemas.ts
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-contract-actions.ts
│   │   │   │   ├── use-contract-form.ts
│   │   │   │   └── use-contracts.ts
│   │   │   ├── index.ts
│   │   │   ├── providers
│   │   │   │   ├── contract-context.tsx
│   │   │   │   └── index.ts
│   │   │   ├── services
│   │   │   │   ├── README.md
│   │   │   │   ├── change-order.service.ts
│   │   │   │   ├── contract.service.ts
│   │   │   │   ├── export.service.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── payment.service.ts
│   │   │   ├── sheets
│   │   │   │   ├── contract-details-sheet.tsx
│   │   │   │   ├── contract-edit-sheet.tsx
│   │   │   │   └── index.ts
│   │   │   ├── tables
│   │   │   │   ├── change-orders-table.tsx
│   │   │   │   ├── contracts-table.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── payments-table.tsx
│   │   │   ├── types
│   │   │   │   ├── change-order.types.ts
│   │   │   │   ├── contract-version.types.ts
│   │   │   │   ├── contract.types.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── payment.types.ts
│   │   │   ├── utils
│   │   │   │   ├── contract.utils.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── status.utils.ts
│   │   │   │   └── validation.utils.ts
│   │   │   └── views
│   │   │       ├── contract-detail-view.tsx
│   │   │       ├── contract-list-view.tsx
│   │   │       ├── contracts-view.tsx
│   │   │       ├── create-contract-view.tsx
│   │   │       └── index.ts
│   │   ├── dashboard
│   │   │   ├── README.md
│   │   │   ├── ai-usage-log.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── dashboard-view.tsx
│   │   │   └── dashboard.tsx
│   │   ├── docu-parse
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── docu-parse-actions.ts
│   │   │   ├── components
│   │   │   │   └── file-selector.tsx
│   │   │   ├── constants
│   │   │   │   ├── file-constants.ts
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── tables
│   │   │   │   ├── index.ts
│   │   │   │   └── work-items-table.tsx
│   │   │   ├── types
│   │   │   │   ├── docu-parse.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils
│   │   │   │   ├── export.utils.ts
│   │   │   │   └── index.ts
│   │   │   └── views
│   │   │       └── docu-parse-view.tsx
│   │   ├── documents
│   │   │   └── README.md
│   │   ├── index.ts
│   │   ├── kanban
│   │   │   ├── README.md
│   │   │   ├── components
│   │   │   │   ├── kanban-board.tsx
│   │   │   │   ├── kanban-card.tsx
│   │   │   │   └── kanban-column.tsx
│   │   │   ├── data
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   └── use-kanban.ts
│   │   │   ├── index.ts
│   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── views
│   │   │       └── kanban-view.tsx
│   │   ├── partnerverse
│   │   │   ├── README.md
│   │   │   ├── compliance
│   │   │   │   ├── README.md
│   │   │   │   └── compliance-tab.tsx
│   │   │   ├── contacts
│   │   │   │   ├── README.md
│   │   │   │   ├── contacts-tab.tsx
│   │   │   │   └── forms
│   │   │   │       ├── README.md
│   │   │   │       └── contact-form.tsx
│   │   │   ├── contracts
│   │   │   │   ├── README.md
│   │   │   │   └── contracts-tab.tsx
│   │   │   ├── dashboard
│   │   │   │   └── dashboard.tsx
│   │   │   ├── financials
│   │   │   │   ├── README.md
│   │   │   │   ├── financials-tab.tsx
│   │   │   │   └── workflow-designer.tsx
│   │   │   ├── overview
│   │   │   │   ├── README.md
│   │   │   │   └── overview-tab.tsx
│   │   │   ├── partners
│   │   │   │   ├── README.md
│   │   │   │   ├── forms
│   │   │   │   │   ├── contact-form.tsx
│   │   │   │   │   └── partner-form.tsx
│   │   │   │   ├── list
│   │   │   │   │   └── partner-list.tsx
│   │   │   │   ├── partner-list.tsx
│   │   │   │   ├── partner-profile.tsx
│   │   │   │   ├── partners-view.tsx
│   │   │   │   └── profile
│   │   │   │       ├── partner-profile.tsx
│   │   │   │       └── profile-header.tsx
│   │   │   ├── performance
│   │   │   │   ├── README.md
│   │   │   │   └── performance-tab.tsx
│   │   │   ├── transactions
│   │   │   │   ├── README.md
│   │   │   │   └── transactions-tab.tsx
│   │   │   └── workflows
│   │   │       └── workflow-builder.tsx
│   │   ├── profile
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── profile-actions.ts
│   │   │   ├── profile-form.tsx
│   │   │   ├── profile-view.tsx
│   │   │   └── public-profile-view.tsx
│   │   ├── projects
│   │   │   ├── README.md
│   │   │   ├── actions
│   │   │   │   └── project-actions.ts
│   │   │   ├── ai-subtask-suggestions.tsx
│   │   │   ├── create-project-dialog.tsx
│   │   │   ├── project-details-sheet.tsx
│   │   │   ├── task-item.tsx
│   │   │   └── views
│   │   │       └── projects-view.tsx
│   │   ├── quick-actions
│   │   │   ├── README.md
│   │   │   ├── daily-report
│   │   │   │   ├── daily-report-view.tsx
│   │   │   │   └── index.ts
│   │   │   ├── project-progress
│   │   │   │   ├── index.ts
│   │   │   │   └── project-progress-view.tsx
│   │   │   └── staff-attendance
│   │   │       ├── index.ts
│   │   │       └── staff-attendance-view.tsx
│   │   ├── settings
│   │   │   ├── README.md
│   │   │   └── settings-view.tsx
│   │   ├── storage-manager
│   │   │   ├── README.md
│   │   │   └── components
│   │   │       └── storage-item-card.tsx
│   │   └── team
│   │       ├── index.ts
│   │       ├── knowledge-base
│   │       │   ├── README.md
│   │       │   ├── actions
│   │       │   │   ├── index.ts
│   │       │   │   ├── knowledge-actions.ts
│   │       │   │   └── types.ts
│   │       │   ├── entry-form-dialog.tsx
│   │       │   └── page.tsx
│   │       ├── members
│   │       │   ├── README.md
│   │       │   ├── create-member-dialog.tsx
│   │       │   └── page.tsx
│   │       ├── schedule
│   │       │   └── README.md
│   │       └── skills
│   │           ├── README.md
│   │           ├── skill-form-dialog.tsx
│   │           └── skills-list.tsx
│   ├── layout
│   │   ├── README.md
│   │   ├── core
│   │   │   ├── app-header.tsx
│   │   │   ├── app-provider.tsx
│   │   │   ├── app-shell.tsx
│   │   │   ├── layout-wrapper.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── index.ts
│   │   ├── navigation
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── navigation-menu-item.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── notification-center.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   ├── search-command.tsx
│   │   │   ├── unified-sidebar.tsx
│   │   │   └── user-menu.tsx
│   │   ├── overlays
│   │   │   ├── drawer-container.tsx
│   │   │   ├── modal-container.tsx
│   │   │   ├── popover-container.tsx
│   │   │   └── tooltip-provider.tsx
│   │   ├── responsive
│   │   │   ├── mobile-menu.tsx
│   │   │   └── responsive-wrapper.tsx
│   │   └── shared
│   │       ├── empty-state.tsx
│   │       ├── logo.tsx
│   │       ├── page-container.tsx
│   │       ├── page-header.tsx
│   │       ├── section-divider.tsx
│   │       └── status-indicator.tsx
│   └── ui
│       ├── README.md
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── tooltip.tsx
├── config
│   ├── README.md
│   └── navigation.config.ts
├── context
│   ├── ProjectContext.tsx
│   └── README.md
├── docs
│   ├── 1-architecture
│   │   ├── auth.md
│   │   ├── database.md
│   │   ├── events.md
│   │   └── layout.md
│   ├── 2-core-modules
│   │   ├── blog.md
│   │   ├── contracts.md
│   │   ├── partnerverse.md
│   │   ├── project.md
│   │   └── team.md
│   ├── 3-ai-features
│   │   ├── ai.md
│   │   ├── cloud-drive.md
│   │   └── docu-parse.md
│   ├── 4-system-blueprints
│   │   ├── blog-management.md
│   │   ├── career-management.md
│   │   ├── contact-management.md
│   │   ├── content-management.md
│   │   ├── cost-tracking.md
│   │   ├── daily-report.md
│   │   ├── delegation-and-acceptance-system.md
│   │   ├── development-roadmap.md
│   │   ├── inventory.md
│   │   ├── layout-build.md
│   │   ├── progress-billing.md
│   │   ├── project_v1.md
│   │   ├── resource-scheduling.md
│   │   ├── system-management.md
│   │   └── web-push-notifications.md
│   └── README.md
├── hooks
│   ├── README.md
│   ├── use-mobile.tsx
│   ├── use-notifications.ts
│   └── use-toast.ts
└── lib
    ├── README.md
    ├── db
    │   ├── firebase-admin
    │   │   └── firebase-admin.ts
    │   ├── firebase-client
    │   │   └── firebase-client.ts
    │   └── mongoose
    │       └── mongodb.ts
    ├── events
    │   ├── app-events.ts
    │   └── event-dispatcher.ts
    ├── models
    │   ├── README.md
    │   └── ai-token-log.model.ts
    ├── services
    │   ├── README.md
    │   ├── activity-log
    │   │   ├── activity-log.listeners.ts
    │   │   └── activity-log.service.ts
    │   ├── ai-token-log
    │   │   ├── README.md
    │   │   └── logging.service.ts
    │   ├── contracts
    │   │   ├── README.md
    │   │   ├── contract-api.service.ts
    │   │   ├── contract-cache.service.ts
    │   │   ├── firebase-contract.service.ts
    │   │   └── index.ts
    │   └── notification
    │       ├── notification.listeners.ts
    │       └── notification.service.ts
    ├── types
    │   ├── README.md
    │   ├── contracts
    │   │   ├── README.md
    │   │   ├── change-order.types.ts
    │   │   ├── contract-version.types.ts
    │   │   ├── contract.types.ts
    │   │   ├── index.ts
    │   │   └── payment.types.ts
    │   └── types.ts
    └── utils
        └── utils.ts
```