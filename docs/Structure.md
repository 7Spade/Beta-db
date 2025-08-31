├─ai
│ │ dev.ts
│ │ genkit.ts
│ │ README.md
│ │
│ └─flows
│ extract-work-items-flow.ts
│ generate-knowledge-entry-flow.ts
│ generate-skill-flow.ts
│ generate-subtasks-flow.ts
│
├─api
│ │ README.md
│ │
│ ├─client
│ │ │ README.md
│ │ │
│ │ ├─core
│ │ │ README.md
│ │ │
│ │ ├─hooks
│ │ │ README.md
│ │ │
│ │ └─services
│ │ README.md
│ │
│ ├─server
│ │ │ README.md
│ │ │
│ │ ├─handlers
│ │ │ README.md
│ │ │
│ │ ├─middleware
│ │ │ README.md
│ │ │
│ │ └─validators
│ │ README.md
│ │
│ └─types
│ │ README.md
│ │
│ ├─common
│ │ README.md
│ │
│ ├─requests
│ │ README.md
│ │
│ └─responses
│ README.md
│
├─app
│ │ error.tsx
│ │ globals.css
│ │ layout.tsx
│ │ README.md
│ │
│ ├─(auth)
│ │ │ layout.tsx
│ │ │ README.md
│ │ │
│ │ ├─login
│ │ │ page.tsx
│ │ │
│ │ ├─pending-approval
│ │ │ page.tsx
│ │ │
│ │ ├─profile
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─[id]
│ │ │ page.tsx
│ │ │
│ │ ├─register
│ │ │ page.tsx
│ │ │
│ │ ├─reset-password
│ │ │ page.tsx
│ │ │
│ │ └─verify-email
│ │ page.tsx
│ │
│ ├─(dashboard)
│ │ │ layout.tsx
│ │ │ README.md
│ │ │
│ │ ├─(business-intelligence)
│ │ │ README.md
│ │ │
│ │ ├─(communication)
│ │ │ README.md
│ │ │
│ │ ├─(crm-management)
│ │ │ │ README.md
│ │ │ │
│ │ │ ├─partners
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─workflows
│ │ │ page.tsx
│ │ │
│ │ ├─(document-management)
│ │ │ README.md
│ │ │
│ │ ├─(enhanced-inventory)
│ │ │ │ README.md
│ │ │ │
│ │ │ ├─items
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─movements
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─transfers
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─warehouses
│ │ │ page.tsx
│ │ │
│ │ ├─(finance-management)
│ │ │ README.md
│ │ │
│ │ ├─(hr-management)
│ │ │ README.md
│ │ │
│ │ ├─(project-management)
│ │ │ README.md
│ │ │
│ │ ├─(quality-management)
│ │ │ README.md
│ │ │
│ │ ├─(reporting-analytics)
│ │ │ README.md
│ │ │
│ │ ├─(security-compliance)
│ │ │ README.md
│ │ │
│ │ ├─(system-administration)
│ │ │ README.md
│ │ │
│ │ ├─(workflow-automation)
│ │ │ README.md
│ │ │
│ │ ├─contracts
│ │ │ ├─billing
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─contracts
│ │ │ │ layout.tsx
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─create
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─[id]
│ │ │ page.tsx
│ │ │
│ │ ├─dashboard
│ │ │ page.tsx
│ │ │
│ │ ├─projects
│ │ │ page.tsx
│ │ │
│ │ ├─quick-actions
│ │ │ ├─cloud-drive
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─daily-report
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─docu-parse
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─kanban
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─project-progress
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─staff-attendance
│ │ │ page.tsx
│ │ │
│ │ ├─settings
│ │ │ page.tsx
│ │ │
│ │ ├─team
│ │ │ ├─knowledge-base
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─members
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─schedule
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─skills
│ │ │ page.tsx
│ │ │
│ │ └─website-cms
│ │ │ layout.tsx
│ │ │
│ │ ├─blog-management
│ │ │ └─posts
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─[id]
│ │ │ page.tsx
│ │ │
│ │ ├─career-management
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─applications
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─jobs
│ │ │ page.tsx
│ │ │
│ │ ├─contact-management
│ │ │ page.tsx
│ │ │
│ │ ├─content-management
│ │ │ │ page.tsx
│ │ │ │
│ │ │ ├─media
│ │ │ │ page.tsx
│ │ │ │
│ │ │ └─pages
│ │ │ page.tsx
│ │ │
│ │ ├─dashboard-management
│ │ │ page.tsx
│ │ │
│ │ ├─system-management
│ │ │ page.tsx
│ │ │
│ │ └─user-management
│ │ page.tsx
│ │
│ └─(public)
│ │ layout.tsx
│ │ page.tsx
│ │ README.md
│ │
│ ├─about
│ │ page.tsx
│ │
│ ├─blog
│ │ │ page.tsx
│ │ │
│ │ └─[slug]
│ │ page.tsx
│ │
│ ├─careers
│ │ page.tsx
│ │
│ ├─contact
│ │ page.tsx
│ │
│ ├─privacy-policy
│ │ page.tsx
│ │
│ └─terms-of-service
│ page.tsx
│
├─components
│ │ README.md
│ │
│ ├─layout
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─core
│ │ │ app-header.tsx
│ │ │ app-provider.tsx
│ │ │ app-shell.tsx
│ │ │ layout-wrapper.tsx
│ │ │ theme-provider.tsx
│ │ │
│ │ ├─navigation
│ │ │ breadcrumb.tsx
│ │ │ context-menu.tsx
│ │ │ navigation-menu-item.tsx
│ │ │ navigation-menu.tsx
│ │ │ notification-center.tsx
│ │ │ quick-actions.tsx
│ │ │ search-command.tsx
│ │ │ unified-sidebar.tsx
│ │ │ user-menu.tsx
│ │ │
│ │ ├─overlays
│ │ │ drawer-container.tsx
│ │ │ modal-container.tsx
│ │ │ popover-container.tsx
│ │ │ tooltip-provider.tsx
│ │ │
│ │ ├─responsive
│ │ │ mobile-menu.tsx
│ │ │ responsive-wrapper.tsx
│ │ │
│ │ └─shared
│ │ document-preview.tsx
│ │ empty-state.tsx
│ │ logo.tsx
│ │ page-container.tsx
│ │ page-header.tsx
│ │ section-divider.tsx
│ │ status-indicator.tsx
│ │
│ └─ui
│ accordion.tsx
│ alert-dialog.tsx
│ alert.tsx
│ aspect-ratio.tsx
│ avatar.tsx
│ badge.tsx
│ breadcrumb.tsx
│ button.tsx
│ calendar.tsx
│ card.tsx
│ carousel.tsx
│ chart.tsx
│ checkbox.tsx
│ collapsible.tsx
│ command.tsx
│ context-menu.tsx
│ dialog.tsx
│ drawer.tsx
│ dropdown-menu.tsx
│ form.tsx
│ heading.tsx
│ hover-card.tsx
│ input-otp.tsx
│ input.tsx
│ label.tsx
│ menubar.tsx
│ modal.tsx
│ navigation-menu.tsx
│ pagination.tsx
│ popover.tsx
│ progress.tsx
│ radio-group.tsx
│ README.md
│ resizable.tsx
│ scroll-area.tsx
│ select.tsx
│ separator.tsx
│ sheet.tsx
│ sidebar.tsx
│ skeleton.tsx
│ slider.tsx
│ sonner.tsx
│ switch.tsx
│ table.tsx
│ tabs.tsx
│ textarea.tsx
│ toast.tsx
│ toaster.tsx
│ toggle-group.tsx
│ toggle.tsx
│ tooltip.tsx
│
├─features
│ │ index.ts
│ │ README.md
│ │
│ ├─(crm-management)
│ │ │ README.md
│ │ │
│ │ ├─compliance
│ │ │ compliance-tab.tsx
│ │ │ README.md
│ │ │
│ │ ├─contacts
│ │ │ │ contacts-tab.tsx
│ │ │ │ README.md
│ │ │ │
│ │ │ └─forms
│ │ │ contact-form.tsx
│ │ │ README.md
│ │ │
│ │ ├─contracts
│ │ │ contracts-tab.tsx
│ │ │ README.md
│ │ │
│ │ ├─dashboard
│ │ │ dashboard.tsx
│ │ │ README.md
│ │ │
│ │ ├─financials
│ │ │ financials-tab.tsx
│ │ │ README.md
│ │ │ workflow-designer.tsx
│ │ │
│ │ ├─overview
│ │ │ overview-tab.tsx
│ │ │ README.md
│ │ │
│ │ ├─partners
│ │ │ │ partner-list.tsx
│ │ │ │ partner-profile.tsx
│ │ │ │ partners-view.tsx
│ │ │ │ README.md
│ │ │ │
│ │ │ ├─forms
│ │ │ │ contact-form.tsx
│ │ │ │ partner-form.tsx
│ │ │ │ README.md
│ │ │ │
│ │ │ ├─list
│ │ │ │ partner-list.tsx
│ │ │ │ README.md
│ │ │ │
│ │ │ └─profile
│ │ │ partner-profile.tsx
│ │ │ profile-header.tsx
│ │ │ README.md
│ │ │
│ │ ├─performance
│ │ │ performance-tab.tsx
│ │ │ README.md
│ │ │
│ │ ├─transactions
│ │ │ README.md
│ │ │ transactions-tab.tsx
│ │ │
│ │ └─workflows
│ │ README.md
│ │ workflow-builder.tsx
│ │
│ ├─(enhanced-inventory)
│ │ │ README.md
│ │ │
│ │ ├─items
│ │ │ README.md
│ │ │
│ │ ├─movements
│ │ │ README.md
│ │ │
│ │ ├─transfers
│ │ │ README.md
│ │ │
│ │ └─warehouses
│ │ README.md
│ │
│ ├─admin
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ user-actions.ts
│ │ │
│ │ └─views
│ │ admin-dashboard-view.tsx
│ │ user-management-view.tsx
│ │
│ ├─auth
│ │ auth-actions.ts
│ │ auth-form-schemas.ts
│ │ auth-provider.tsx
│ │ auth.config.ts
│ │ auth.utils.ts
│ │ index.ts
│ │ login-view.tsx
│ │ pending-approval-view.tsx
│ │ README.md
│ │ register-view.tsx
│ │ social-auth-buttons.tsx
│ │ use-auth.ts
│ │ verify-email-view.tsx
│ │
│ ├─blog
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ posts.actions.ts
│ │ │
│ │ └─views
│ │ post-form-view.tsx
│ │ posts-list-view.tsx
│ │
│ ├─career-management
│ │ README.md
│ │
│ ├─cloud-drive
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ storage-actions.ts
│ │ │
│ │ ├─components
│ │ │ file-browser.tsx
│ │ │ file-card.tsx
│ │ │ folder-card.tsx
│ │ │ upload-button.tsx
│ │ │
│ │ ├─types
│ │ │ storage.types.ts
│ │ │
│ │ ├─utils
│ │ │ path.utils.ts
│ │ │
│ │ └─views
│ │ cloud-drive-view.tsx
│ │
│ ├─contact-management
│ │ README.md
│ │
│ ├─content-management
│ │ README.md
│ │
│ ├─contracts
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ contract-actions.ts
│ │ │ index.ts
│ │ │ MIGRATION.md
│ │ │ README.md
│ │ │ types.ts
│ │ │
│ │ ├─components
│ │ │ change-order-item.tsx
│ │ │ contract-status-badge.tsx
│ │ │ contract-summary-card.tsx
│ │ │ index.ts
│ │ │ payment-progress.tsx
│ │ │ README.md
│ │ │ receipt-progress.tsx
│ │ │ version-timeline.tsx
│ │ │
│ │ ├─constants
│ │ │ contract.constants.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │ ui.constants.ts
│ │ │
│ │ ├─dashboard
│ │ │ contract-charts.tsx
│ │ │ contract-dashboard.tsx
│ │ │ contract-stats.tsx
│ │ │ dashboard.tsx
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─dialogs
│ │ │ create-contract-dialog.tsx
│ │ │ delete-contract-dialog.tsx
│ │ │ edit-contract-dialog.tsx
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─forms
│ │ │ contract-form.tsx
│ │ │ create-contract-form.tsx
│ │ │ edit-contract-form.tsx
│ │ │ form-schemas.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─hooks
│ │ │ index.ts
│ │ │ README.md
│ │ │ use-contract-actions.ts
│ │ │ use-contract-form.ts
│ │ │ use-contracts.ts
│ │ │
│ │ ├─providers
│ │ │ contract-context.tsx
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─services
│ │ │ change-order.service.ts
│ │ │ contract.service.ts
│ │ │ export.service.ts
│ │ │ index.ts
│ │ │ payment.service.ts
│ │ │ README.md
│ │ │ receipt.service.ts
│ │ │
│ │ ├─sheets
│ │ │ contract-details-sheet.tsx
│ │ │ contract-edit-sheet.tsx
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─tables
│ │ │ change-orders-table.tsx
│ │ │ contracts-table.tsx
│ │ │ index.ts
│ │ │ payments-table.tsx
│ │ │ README.md
│ │ │ receipts-table.tsx
│ │ │
│ │ ├─types
│ │ │ change-order.types.ts
│ │ │ contract-version.types.ts
│ │ │ contract.types.ts
│ │ │ index.ts
│ │ │ payment.types.ts
│ │ │ README.md
│ │ │ receipt.types.ts
│ │ │
│ │ ├─utils
│ │ │ contract.utils.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │ status.utils.ts
│ │ │ validation.utils.ts
│ │ │
│ │ └─views
│ │ contract-detail-view.tsx
│ │ contract-list-view.tsx
│ │ contracts-view.tsx
│ │ create-contract-view.tsx
│ │ index.ts
│ │ README.md
│ │
│ ├─dashboard
│ │ ai-usage-log.tsx
│ │ dashboard-stats.tsx
│ │ dashboard-view.tsx
│ │ dashboard.tsx
│ │ README.md
│ │
│ ├─docu-parse
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ docu-parse-actions.ts
│ │ │ docu-parse-commit.actions.ts
│ │ │
│ │ ├─components
│ │ │ file-selector.tsx
│ │ │
│ │ ├─constants
│ │ │ file-constants.ts
│ │ │ index.ts
│ │ │
│ │ ├─tables
│ │ │ index.ts
│ │ │ work-items-table.tsx
│ │ │
│ │ ├─types
│ │ │ docu-parse.types.ts
│ │ │ index.ts
│ │ │
│ │ ├─utils
│ │ │ export.utils.ts
│ │ │ index.ts
│ │ │
│ │ └─views
│ │ docu-parse-view.tsx
│ │
│ ├─integrations
│ │ README.md
│ │
│ ├─kanban
│ │ │ index.ts
│ │ │ README.md
│ │ │ types.ts
│ │ │
│ │ ├─components
│ │ │ kanban-board.tsx
│ │ │ kanban-card.tsx
│ │ │ kanban-column.tsx
│ │ │ note-card.tsx
│ │ │ notes-grid.tsx
│ │ │ quick-note.tsx
│ │ │
│ │ ├─data
│ │ │ index.ts
│ │ │
│ │ ├─hooks
│ │ │ use-kanban.ts
│ │ │
│ │ ├─types
│ │ │ index.ts
│ │ │
│ │ └─views
│ │ kanban-view.tsx
│ │
│ ├─mobile-app
│ │ README.md
│ │
│ ├─multi-tenancy
│ │ README.md
│ │
│ ├─profile
│ │ │ profile-form.tsx
│ │ │ profile-view.tsx
│ │ │ public-profile-view.tsx
│ │ │ README.md
│ │ │
│ │ └─actions
│ │ profile-actions.ts
│ │
│ ├─projects
│ │ │ ai-subtask-suggestions.tsx
│ │ │ create-project-dialog.tsx
│ │ │ project-details-sheet.tsx
│ │ │ README.md
│ │ │ task-item.tsx
│ │ │
│ │ ├─actions
│ │ │ project.actions.ts
│ │ │
│ │ └─views
│ │ projects-view.tsx
│ │
│ ├─quick-actions
│ │ │ README.md
│ │ │
│ │ ├─cloud-drive
│ │ │ README.md
│ │ │
│ │ ├─daily-report
│ │ │ daily-report-view.tsx
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─docu-parse
│ │ │ README.md
│ │ │
│ │ ├─kanban
│ │ │ README.md
│ │ │
│ │ ├─project-progress
│ │ │ index.ts
│ │ │ project-progress-view.tsx
│ │ │ README.md
│ │ │
│ │ └─staff-attendance
│ │ index.ts
│ │ README.md
│ │ staff-attendance-view.tsx
│ │
│ ├─settings
│ │ README.md
│ │ settings-view.tsx
│ │
│ ├─system-management
│ │ README.md
│ │
│ ├─team
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─actions
│ │ │ README.md
│ │ │
│ │ ├─knowledge-base
│ │ │ │ entry-form-dialog.tsx
│ │ │ │ page.tsx
│ │ │ │ README.md
│ │ │ │
│ │ │ └─actions
│ │ │ index.ts
│ │ │ knowledge-actions.ts
│ │ │ types.ts
│ │ │
│ │ ├─members
│ │ │ create-member-dialog.tsx
│ │ │ page.tsx
│ │ │ README.md
│ │ │
│ │ ├─schedule
│ │ │ README.md
│ │ │
│ │ └─skills
│ │ README.md
│ │ skill-form-dialog.tsx
│ │ skills-list.tsx
│ │
│ ├─warehousing
│ │ README.md
│ │
│ ├─website-cms
│ │ ├─blog-management
│ │ │ README.md
│ │ │
│ │ ├─career-management
│ │ │ README.md
│ │ │
│ │ ├─contact-management
│ │ │ README.md
│ │ │
│ │ ├─content-management
│ │ │ README.md
│ │ │
│ │ ├─dashboard-management
│ │ │ README.md
│ │ │
│ │ ├─system-management
│ │ │ README.md
│ │ │
│ │ └─user-management
│ │ README.md
│ │
│ └─workflow-automation
│ README.md
│
├─lib
│ │ README.md
│ │
│ ├─config
│ │ navigation.config.ts
│ │ README.md
│ │
│ ├─constants
│ │ roles.ts
│ │
│ ├─db
│ │ │ README.md
│ │ │
│ │ ├─firebase-admin
│ │ │ firebase-admin.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─firebase-client
│ │ │ firebase-client.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ ├─mongoose
│ │ │ mongodb.ts
│ │ │ README.md
│ │ │
│ │ ├─redis
│ │ │ README.md
│ │ │ redis-client.ts
│ │ │
│ │ └─supabase
│ │ client.ts
│ │ index.ts
│ │ middleware.ts
│ │ README.md
│ │ server.ts
│ │ types.ts
│ │
│ ├─events
│ │ app-events.ts
│ │ event-dispatcher.ts
│ │
│ ├─hooks
│ │ index.ts
│ │ README.md
│ │ use-mobile.tsx
│ │ use-notifications.ts
│ │ use-toast.ts
│ │
│ ├─models
│ │ ai-token-log.model.ts
│ │ README.md
│ │
│ ├─services
│ │ │ README.md
│ │ │
│ │ ├─activity-log
│ │ │ activity-log.listeners.ts
│ │ │ activity-log.service.ts
│ │ │ README.md
│ │ │
│ │ ├─ai-token-log
│ │ │ logging.service.ts
│ │ │ README.md
│ │ │
│ │ ├─contracts
│ │ │ contract-api.service.ts
│ │ │ contract-cache.service.ts
│ │ │ firebase-contract.service.ts
│ │ │ index.ts
│ │ │ README.md
│ │ │
│ │ └─notification
│ │ notification.listeners.ts
│ │ notification.service.ts
│ │ README.md
│ │
│ ├─types
│ │ │ env.types.ts
│ │ │ errors.ts
│ │ │ README.md
│ │ │ types.ts
│ │ │
│ │ └─contracts
│ │ change-order.types.ts
│ │ contract-version.types.ts
│ │ contract.types.ts
│ │ index.ts
│ │ payment.types.ts
│ │ README.md
│ │
│ └─utils
│ auth-utils.ts
│ date-utils.ts
│ index.ts
│ utils.ts
│
└─shared
│ │ README.md
│ │
│ ├─constants
│ │ README.md
│ │
│ ├─enums
│ │ README.md
│ │
│ ├─schemas
│ │ README.md
│ │
│ ├─types
│ │ README.md
│ │
│ └─utils
│ README.md
