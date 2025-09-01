├─ai
│  │  dev.ts
│  │  genkit.ts
│  │  README.md
│  │
│  └─flows
│          extract-work-items-flow.ts
│          generate-knowledge-entry-flow.ts
│          generate-skill-flow.ts
│          generate-subtasks-flow.ts
│
├─api
│  │  README.md
│  │
│  ├─client
│  │  │  README.md
│  │  │
│  │  ├─core
│  │  │      README.md
│  │  │
│  │  ├─hooks
│  │  │      README.md
│  │  │
│  │  └─services
│  │          README.md
│  │
│  ├─server
│  │  │  README.md
│  │  │
│  │  ├─handlers
│  │  │      README.md
│  │  │
│  │  ├─middleware
│  │  │      README.md
│  │  │
│  │  └─validators
│  │          README.md
│  │
│  └─types
│      │  README.md
│      │
│      ├─common
│      │      README.md
│      │
│      ├─requests
│      │      README.md
│      │
│      └─responses
│              README.md
│
├─app
│  │  error.tsx
│  │  globals.css
│  │  layout.tsx
│  │  README.md
│  │
│  ├─(app)
│  │  │  layout.tsx
│  │  │  README.md
│  │  │
│  │  ├─automation-tools
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─kanban
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─knowledge-base
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─project-progress
│  │  │          page.tsx
│  │  │
│  │  ├─business-intelligence
│  │  │  │  README.md
│  │  │  │
│  │  │  └─reporting-analytics
│  │  │      │  README.md
│  │  │      │
│  │  │      ├─daily-report
│  │  │      │      page.tsx
│  │  │      │
│  │  │      └─dashboard
│  │  │              page.tsx
│  │  │
│  │  ├─core-operations
│  │  │  ├─contracts
│  │  │  │  ├─billing
│  │  │  │  │      page.tsx
│  │  │  │  │
│  │  │  │  └─contracts
│  │  │  │      │  layout.tsx
│  │  │  │      │  page.tsx
│  │  │  │      │
│  │  │  │      ├─create
│  │  │  │      │      page.tsx
│  │  │  │      │
│  │  │  │      └─[id]
│  │  │  │              page.tsx
│  │  │  │
│  │  │  ├─projects
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─quality
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─schedule
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─security
│  │  │          README.md
│  │  │
│  │  ├─resource-management
│  │  │  ├─crm
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  ├─partners
│  │  │  │  │      page.tsx
│  │  │  │  │
│  │  │  │  └─workflows
│  │  │  │          page.tsx
│  │  │  │
│  │  │  ├─document
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  ├─cloud-drive
│  │  │  │  │      page.tsx
│  │  │  │  │
│  │  │  │  └─docu-parse
│  │  │  │          page.tsx
│  │  │  │
│  │  │  ├─finance
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─hr
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  ├─attendance
│  │  │  │  │      page.tsx
│  │  │  │  │
│  │  │  │  ├─members
│  │  │  │  │      page.tsx
│  │  │  │  │
│  │  │  │  └─skills
│  │  │  │          page.tsx
│  │  │  │
│  │  │  └─inventory
│  │  │      │  README.md
│  │  │      │
│  │  │      ├─items
│  │  │      │      page.tsx
│  │  │      │
│  │  │      ├─movements
│  │  │      │      page.tsx
│  │  │      │
│  │  │      ├─transfers
│  │  │      │      page.tsx
│  │  │      │
│  │  │      └─warehouses
│  │  │              page.tsx
│  │  │
│  │  └─system-administration
│  │      │  README.md
│  │      │
│  │      ├─settings
│  │      │      page.tsx
│  │      │
│  │      └─website-cms
│  │          │  layout.tsx
│  │          │
│  │          ├─blog-management
│  │          │  └─posts
│  │          │      │  page.tsx
│  │          │      │
│  │          │      ├─create
│  │          │      │      page.tsx
│  │          │      │
│  │          │      └─[id]
│  │          │          │  page.tsx
│  │          │          │
│  │          │          └─edit
│  │          │                  page.tsx
│  │          │
│  │          ├─career-management
│  │          │  │  page.tsx
│  │          │  │
│  │          │  ├─applications
│  │          │  │      page.tsx
│  │          │  │
│  │          │  └─jobs
│  │          │          page.tsx
│  │          │
│  │          ├─contact-management
│  │          │      page.tsx
│  │          │
│  │          ├─content-management
│  │          │  │  page.tsx
│  │          │  │
│  │          │  ├─media
│  │          │  │      page.tsx
│  │          │  │
│  │          │  └─pages
│  │          │          page.tsx
│  │          │
│  │          ├─dashboard-management
│  │          │      page.tsx
│  │          │
│  │          ├─system-management
│  │          │      page.tsx
│  │          │
│  │          └─user-management
│  │                  page.tsx
│  │
│  ├─(auth)
│  │  │  layout.tsx
│  │  │  README.md
│  │  │
│  │  ├─login
│  │  │      page.tsx
│  │  │
│  │  ├─pending-approval
│  │  │      page.tsx
│  │  │
│  │  ├─profile
│  │  │  │  page.tsx
│  │  │  │
│  │  │  └─[id]
│  │  │          page.tsx
│  │  │
│  │  ├─register
│  │  │      page.tsx
│  │  │
│  │  ├─reset-password
│  │  │      page.tsx
│  │  │
│  │  └─verify-email
│  │          page.tsx
│  │
│  └─(public)
│      │  layout.tsx
│      │  page.tsx
│      │  README.md
│      │
│      ├─about
│      │      page.tsx
│      │
│      ├─blog
│      │  │  page.tsx
│      │  │
│      │  └─[slug]
│      │          page.tsx
│      │
│      ├─careers
│      │      page.tsx
│      │
│      ├─contact
│      │      page.tsx
│      │
│      ├─privacy-policy
│      │      page.tsx
│      │
│      └─terms-of-service
│              page.tsx
│
├─components
│  │  README.md
│  │
│  ├─layout
│  │  │  index.ts
│  │  │
│  │  ├─core
│  │  │      app-header.tsx
│  │  │      app-provider.tsx
│  │  │      app-shell.tsx
│  │  │      layout-wrapper.tsx
│  │  │      theme-provider.tsx
│  │  │
│  │  ├─navigation
│  │  │      breadcrumb.tsx
│  │  │      context-menu.tsx
│  │  │      navigation-menu-item.tsx
│  │  │      navigation-menu.tsx
│  │  │      notification-center.tsx
│  │  │      quick-actions.tsx
│  │  │      search-command.tsx
│  │  │      unified-sidebar.tsx
│  │  │      user-menu.tsx
│  │  │
│  │  ├─overlays
│  │  │      drawer-container.tsx
│  │  │      modal-container.tsx
│  │  │      popover-container.tsx
│  │  │      tooltip-provider.tsx
│  │  │
│  │  ├─responsive
│  │  │      mobile-menu.tsx
│  │  │      responsive-wrapper.tsx
│  │  │
│  │  └─shared
│  │          document-preview.tsx
│  │          empty-state.tsx
│  │          logo.tsx
│  │          page-container.tsx
│  │          page-header.tsx
│  │          section-divider.tsx
│  │          status-indicator.tsx
│  │
│  └─ui
│          accordion.tsx
│          alert-dialog.tsx
│          alert.tsx
│          aspect-ratio.tsx
│          avatar.tsx
│          badge.tsx
│          breadcrumb.tsx
│          button.tsx
│          calendar.tsx
│          card.tsx
│          carousel.tsx
│          chart.tsx
│          checkbox.tsx
│          collapsible.tsx
│          command.tsx
│          context-menu.tsx
│          dialog.tsx
│          drawer.tsx
│          dropdown-menu.tsx
│          form.tsx
│          heading.tsx
│          hover-card.tsx
│          input-otp.tsx
│          input.tsx
│          label.tsx
│          menubar.tsx
│          modal.tsx
│          navigation-menu.tsx
│          pagination.tsx
│          popover.tsx
│          progress.tsx
│          radio-group.tsx
│          resizable.tsx
│          scroll-area.tsx
│          select.tsx
│          separator.tsx
│          sheet.tsx
│          sidebar.tsx
│          skeleton.tsx
│          slider.tsx
│          sonner.tsx
│          switch.tsx
│          table.tsx
│          tabs.tsx
│          textarea.tsx
│          toast.tsx
│          toaster.tsx
│          toggle-group.tsx
│          toggle.tsx
│          tooltip.tsx
│
├─features
│  │  index.ts
│  │  README.md
│  │
│  ├─(automation-tools)
│  │  │  README.md
│  │  │
│  │  ├─docu-parse
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      docu-parse-actions.ts
│  │  │  │      docu-parse-commit.actions.ts
│  │  │  │
│  │  │  ├─components
│  │  │  │      file-selector.tsx
│  │  │  │
│  │  │  ├─constants
│  │  │  │      file-constants.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─tables
│  │  │  │      index.ts
│  │  │  │      work-items-table.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      docu-parse.types.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      export.utils.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─views
│  │  │          docu-parse-view.tsx
│  │  │
│  │  └─kanban
│  │      │  index.ts
│  │      │  README.md
│  │      │  types.ts
│  │      │
│  │      ├─components
│  │      │      kanban-board.tsx
│  │      │      kanban-card.tsx
│  │      │      kanban-column.tsx
│  │      │      note-card.tsx
│  │      │      notes-grid.tsx
│  │      │      quick-note.tsx
│  │      │
│  │      ├─data
│  │      │      index.ts
│  │      │
│  │      ├─hooks
│  │      │      use-kanban.ts
│  │      │
│  │      ├─types
│  │      │      index.ts
│  │      │
│  │      └─views
│  │              kanban-view.tsx
│  │
│  ├─(business-intelligence)
│  │  │  README.md
│  │  │
│  │  ├─(finance-management)
│  │  │      README.md
│  │  │
│  │  ├─(quality-management)
│  │  │      README.md
│  │  │
│  │  └─(reporting-analytics)
│  │      │  README.md
│  │      │
│  │      ├─daily-report
│  │      │      daily-report-view.tsx
│  │      │
│  │      └─dashboard
│  │              ai-usage-log.tsx
│  │              dashboard-stats.tsx
│  │              dashboard-view.tsx
│  │              dashboard.tsx
│  │              README.md
│  │
│  ├─(core-operations)
│  │  │  README.md
│  │  │
│  │  ├─contracts
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      contract-actions.ts
│  │  │  │      index.ts
│  │  │  │      MIGRATION.md
│  │  │  │      README.md
│  │  │  │      types.ts
│  │  │  │
│  │  │  ├─components
│  │  │  │      change-order-item.tsx
│  │  │  │      contract-status-badge.tsx
│  │  │  │      contract-summary-card.tsx
│  │  │  │      index.ts
│  │  │  │      payment-progress.tsx
│  │  │  │      README.md
│  │  │  │      receipt-progress.tsx
│  │  │  │      version-timeline.tsx
│  │  │  │
│  │  │  ├─constants
│  │  │  │      contract.constants.ts
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │      ui.constants.ts
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      contract-charts.tsx
│  │  │  │      contract-dashboard.tsx
│  │  │  │      contract-stats.tsx
│  │  │  │      dashboard.tsx
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─dialogs
│  │  │  │      create-contract-dialog.tsx
│  │  │  │      delete-contract-dialog.tsx
│  │  │  │      edit-contract-dialog.tsx
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─forms
│  │  │  │      contract-form.tsx
│  │  │  │      create-contract-form.tsx
│  │  │  │      edit-contract-form.tsx
│  │  │  │      form-schemas.ts
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─hooks
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │      use-contract-actions.ts
│  │  │  │      use-contract-form.ts
│  │  │  │      use-contracts.ts
│  │  │  │
│  │  │  ├─providers
│  │  │  │      contract-context.tsx
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─services
│  │  │  │      change-order.service.ts
│  │  │  │      contract.service.ts
│  │  │  │      export.service.ts
│  │  │  │      index.ts
│  │  │  │      payment.service.ts
│  │  │  │      README.md
│  │  │  │      receipt.service.ts
│  │  │  │
│  │  │  ├─sheets
│  │  │  │      contract-details-sheet.tsx
│  │  │  │      contract-edit-sheet.tsx
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─tables
│  │  │  │      change-orders-table.tsx
│  │  │  │      contracts-table.tsx
│  │  │  │      index.ts
│  │  │  │      payments-table.tsx
│  │  │  │      README.md
│  │  │  │      receipts-table.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      change-order.types.ts
│  │  │  │      contract-version.types.ts
│  │  │  │      contract.types.ts
│  │  │  │      index.ts
│  │  │  │      payment.types.ts
│  │  │  │      README.md
│  │  │  │      receipt.types.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      contract.utils.ts
│  │  │  │      index.ts
│  │  │  │      README.md
│  │  │  │      status.utils.ts
│  │  │  │      validation.utils.ts
│  │  │  │
│  │  │  └─views
│  │  │          contract-detail-view.tsx
│  │  │          contract-list-view.tsx
│  │  │          contracts-view.tsx
│  │  │          create-contract-view.tsx
│  │  │          index.ts
│  │  │          README.md
│  │  │
│  │  ├─projects
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      acceptance.actions.ts
│  │  │  │      attachment.actions.ts
│  │  │  │      audit-log.actions.ts
│  │  │  │      budget.actions.ts
│  │  │  │      communication.actions.ts
│  │  │  │      document.actions.ts
│  │  │  │      notification.actions.ts
│  │  │  │      progress.actions.ts
│  │  │  │      project.actions.ts
│  │  │  │      quality.actions.ts
│  │  │  │      README.md
│  │  │  │      report.actions.ts
│  │  │  │      safety.actions.ts
│  │  │  │      subtask.actions.ts
│  │  │  │      task.actions.ts
│  │  │  │      worker.actions.ts
│  │  │  │      workflow.actions.ts
│  │  │  │
│  │  │  ├─components
│  │  │  │      AcceptanceList.tsx
│  │  │  │      AcceptanceStatusBadge.tsx
│  │  │  │      AddSubtaskForm.tsx
│  │  │  │      AddTaskPanel.tsx
│  │  │  │      AiSubtaskSuggestions.tsx
│  │  │  │      CreateProjectDialog.tsx
│  │  │  │      index.ts
│  │  │  │      ProjectCard.tsx
│  │  │  │      ProjectDetailsDialog.tsx
│  │  │  │      ProjectDetailsSheet.tsx
│  │  │  │      ProjectList.tsx
│  │  │  │      ProjectSummary.tsx
│  │  │  │      README.md
│  │  │  │      SubmitProgressDialog.tsx
│  │  │  │      TaskActions.tsx
│  │  │  │      TaskItem.tsx
│  │  │  │      TaskList.tsx
│  │  │  │
│  │  │  ├─project-progress
│  │  │  │      project-progress-view.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─views
│  │  │          index.ts
│  │  │          ProjectView.tsx
│  │  │
│  │  └─schedule
│  │          README.md
│  │
│  ├─(document-management)
│  │  │  README.md
│  │  │
│  │  ├─cloud-drive
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      storage-actions.ts
│  │  │  │
│  │  │  ├─components
│  │  │  │      file-browser.tsx
│  │  │  │      file-card.tsx
│  │  │  │      folder-card.tsx
│  │  │  │      upload-button.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      storage.types.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      path.utils.ts
│  │  │  │
│  │  │  └─views
│  │  │          cloud-drive-view.tsx
│  │  │
│  │  └─knowledge-base
│  │      │  entry-form-dialog.tsx
│  │      │  page.tsx
│  │      │  README.md
│  │      │
│  │      └─actions
│  │              index.ts
│  │              knowledge-actions.ts
│  │              types.ts
│  │
│  ├─(integrations)
│  │      README.md
│  │
│  ├─(quality-management)
│  │      README.md
│  │
│  ├─(resource-management)
│  │  │  README.md
│  │  │
│  │  ├─(crm-management)
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─compliance
│  │  │  │      compliance-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─contacts
│  │  │  │  │  contacts-tab.tsx
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  └─forms
│  │  │  │          contact-form.tsx
│  │  │  │          README.md
│  │  │  │
│  │  │  ├─contracts
│  │  │  │      contracts-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      dashboard.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─financials
│  │  │  │      financials-tab.tsx
│  │  │  │      README.md
│  │  │  │      workflow-designer.tsx
│  │  │  │
│  │  │  ├─overview
│  │  │  │      overview-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─partners
│  │  │  │  │  partner-list.tsx
│  │  │  │  │  partner-profile.tsx
│  │  │  │  │  partners-view.tsx
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  ├─forms
│  │  │  │  │      contact-form.tsx
│  │  │  │  │      partner-form.tsx
│  │  │  │  │      README.md
│  │  │  │  │
│  │  │  │  ├─list
│  │  │  │  │      partner-list.tsx
│  │  │  │  │      README.md
│  │  │  │  │
│  │  │  │  └─profile
│  │  │  │          partner-profile.tsx
│  │  │  │          profile-header.tsx
│  │  │  │          README.md
│  │  │  │
│  │  │  ├─performance
│  │  │  │      performance-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─transactions
│  │  │  │      README.md
│  │  │  │      transactions-tab.tsx
│  │  │  │
│  │  │  └─workflows
│  │  │          README.md
│  │  │          workflow-builder.tsx
│  │  │
│  │  ├─(enhanced-inventory)
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─items
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─movements
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─transfers
│  │  │  │      README.md
│  │  │  │
│  │  │  └─warehouses
│  │  │          README.md
│  │  │
│  │  └─(hr-management)
│  │      │  README.md
│  │      │
│  │      ├─attendance
│  │      │      staff-attendance-view.tsx
│  │      │
│  │      ├─members
│  │      │      create-member-dialog.tsx
│  │      │      page.tsx
│  │      │      README.md
│  │      │
│  │      └─skills
│  │              README.md
│  │              skill-form-dialog.tsx
│  │              skills-list.tsx
│  │
│  └─(system-admin)
│      │  README.md
│      │
│      ├─(security-compliance)
│      │  │  README.md
│      │  │
│      │  └─auth
│      │          auth-actions.ts
│      │          auth-form-schemas.ts
│      │          auth-provider.tsx
│      │          auth.config.ts
│      │          auth.utils.ts
│      │          index.ts
│      │          login-view.tsx
│      │          pending-approval-view.tsx
│      │          README.md
│      │          register-view.tsx
│      │          social-auth-buttons.tsx
│      │          use-auth.ts
│      │          verify-email-view.tsx
│      │
│      ├─(system-administration)
│      │  │  README.md
│      │  │
│      │  └─profile
│      │      │  profile-form.tsx
│      │      │  profile-view.tsx
│      │      │  public-profile-view.tsx
│      │      │  README.md
│      │      │
│      │      └─actions
│      │              profile-actions.ts
│      │
│      ├─admin
│      │  │  README.md
│      │  │
│      │  ├─actions
│      │  │      user-actions.ts
│      │  │
│      │  └─views
│      │          admin-dashboard-view.tsx
│      │          user-management-view.tsx
│      │
│      ├─multi-tenancy
│      │      README.md
│      │
│      ├─settings
│      │      README.md
│      │      settings-view.tsx
│      │
│      └─website-cms
│          ├─blog
│          │  │  README.md
│          │  │
│          │  ├─actions
│          │  │      blog.actions.ts
│          │  │      cache.actions.ts
│          │  │      media.actions.ts
│          │  │
│          │  ├─components
│          │  │  ├─BlogCard
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─BlogEditor
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─BlogList
│          │  │  │      index.tsx
│          │  │  │
│          │  │  └─MediaUploader
│          │  │          index.tsx
│          │  │
│          │  ├─hooks
│          │  │      use-blog-form.ts
│          │  │      use-blog-list.ts
│          │  │
│          │  ├─types
│          │  │      blog.types.ts
│          │  │      media.types.ts
│          │  │
│          │  ├─utils
│          │  │      content.utils.ts
│          │  │      seo.utils.ts
│          │  │      slug.utils.ts
│          │  │
│          │  └─views
│          │          BlogDetailView.tsx
│          │          BlogFormView.tsx
│          │          BlogListView.tsx
│          │          PublicBlogView.tsx
│          │
│          ├─blog-management
│          │      README.md
│          │
│          ├─career
│          │  │  README.md
│          │  │
│          │  ├─actions
│          │  │      application.actions.ts
│          │  │      email.actions.ts
│          │  │      interview.actions.ts
│          │  │      job.actions.ts
│          │  │
│          │  ├─components
│          │  │  ├─ApplicationCard
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─ApplicationList
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─ApplyForm
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─InterviewScheduler
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─JobCard
│          │  │  │      index.tsx
│          │  │  │
│          │  │  ├─JobEditor
│          │  │  │      index.tsx
│          │  │  │
│          │  │  └─JobList
│          │  │          index.tsx
│          │  │
│          │  ├─hooks
│          │  │      use-applications.ts
│          │  │      use-job-form.ts
│          │  │      use-job-list.ts
│          │  │
│          │  ├─types
│          │  │      application.types.ts
│          │  │      interview.types.ts
│          │  │      job.types.ts
│          │  │
│          │  ├─utils
│          │  │      notification.utils.ts
│          │  │      slug.utils.ts
│          │  │      status.utils.ts
│          │  │
│          │  └─views
│          │          ApplicationDetailView.tsx
│          │          ApplicationListView.tsx
│          │          JobFormView.tsx
│          │          JobListView.tsx
│          │          PublicCareerView.tsx
│          │
│          ├─career-management
│          │      README.md
│          │
│          ├─contact-management
│          │      README.md
│          │
│          ├─content-management
│          │      README.md
│          │
│          ├─dashboard-management
│          │      README.md
│          │
│          ├─system-management
│          │      README.md
│          │
│          └─user-management
│                  README.md
│
├─lib
│  │  README.md
│  │
│  ├─config
│  │      navigation.config.ts
│  │      README.md
│  │
│  ├─constants
│  │      roles.ts
│  │
│  ├─db
│  │  │  README.md
│  │  │
│  │  ├─firebase-admin
│  │  │      firebase-admin.ts
│  │  │      index.ts
│  │  │      README.md
│  │  │
│  │  ├─firebase-client
│  │  │      firebase-client.ts
│  │  │      index.ts
│  │  │      README.md
│  │  │
│  │  ├─mongoose
│  │  │      mongodb.ts
│  │  │      README.md
│  │  │
│  │  ├─redis
│  │  │      README.md
│  │  │      redis-client.ts
│  │  │
│  │  └─supabase
│  │          client.ts
│  │          index.ts
│  │          middleware.ts
│  │          README.md
│  │          server.ts
│  │          types.ts
│  │
│  ├─events
│  │      app-events.ts
│  │      event-dispatcher.ts
│  │
│  ├─hooks
│  │      index.ts
│  │      README.md
│  │      use-mobile.tsx
│  │      use-notifications.ts
│  │      use-toast.ts
│  │
│  ├─models
│  │      ai-token-log.model.ts
│  │      README.md
│  │
│  ├─services
│  │  │  README.md
│  │  │
│  │  ├─activity-log
│  │  │      activity-log.listeners.ts
│  │  │      activity-log.service.ts
│  │  │      README.md
│  │  │
│  │  ├─ai-token-log
│  │  │      logging.service.ts
│  │  │      README.md
│  │  │
│  │  ├─blog
│  │  │      blog.service.ts
│  │  │      cache.service.ts
│  │  │      media.service.ts
│  │  │
│  │  ├─career
│  │  │      analytics.service.ts
│  │  │      application.service.ts
│  │  │      email.service.ts
│  │  │      interview.service.ts
│  │  │      job.service.ts
│  │  │      README.md
│  │  │
│  │  ├─contracts
│  │  │      contract-api.service.ts
│  │  │      contract-cache.service.ts
│  │  │      firebase-contract.service.ts
│  │  │      index.ts
│  │  │      README.md
│  │  │
│  │  └─notification
│  │          notification.listeners.ts
│  │          notification.service.ts
│  │          README.md
│  │
│  ├─types
│  │  │  env.types.ts
│  │  │  errors.ts
│  │  │  README.md
│  │  │  types.ts
│  │  │
│  │  └─contracts
│  │          change-order.types.ts
│  │          contract-version.types.ts
│  │          contract.types.ts
│  │          index.ts
│  │          payment.types.ts
│  │          README.md
│  │
│  └─utils
│          auth-utils.ts
│          date-utils.ts
│          index.ts
│          utils.ts
│
└─shared
    │  README.md
    │
    ├─constants
    │      README.md
    │
    ├─enums
    │      README.md
    │
    ├─schemas
    │      README.md
    │
    ├─types
    │      README.md
    │
    └─utils
            README.md
