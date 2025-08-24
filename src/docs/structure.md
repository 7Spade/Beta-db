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
├─app
│  │  error.tsx
│  │  favicon.ico
│  │  globals.css
│  │  layout.tsx
│  │  page.tsx
│  │  README.md
│  │
│  ├─(app)
│  │  │  layout.tsx
│  │  │  README.md
│  │  │
│  │  ├─contracts
│  │  │  │  page.tsx
│  │  │  │
│  │  │  ├─[id]
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─create
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─layout.tsx
│  │  │
│  │  ├─dashboard
│  │  │      page.tsx
│  │  │
│  │  ├─documents
│  │  │      page.tsx
│  │  │
│  │  ├─partnerverse
│  │  │  ├─partners
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─workflows
│  │  │          page.tsx
│  │  │
│  │  ├─projects
│  │  │      page.tsx
│  │  │
│  │  ├─settings
│  │  │      page.tsx
│  │  │
│  │  └─team
│  │      ├─knowledge-base
│  │      │      page.tsx
│  │      │
│  │      ├─members
│  │      │      page.tsx
│  │      │
│  │      ├─schedule
│  │      │      page.tsx
│  │      │
│  │      └─skills
│  │              page.tsx
│  │
│  ├─actions
│  │      contracts.actions.ts
│  │      documents.actions.ts
│  │      knowledge.actions.ts
│  │      README.md
│  │
│  └─api
│      └─ai-token-logs
│              route.ts
│
├─components
│  │  README.md
│  │
│  ├─features
│  │  ├─app
│  │  │      ai-subtask-suggestions.tsx
│  │  │      create-project-dialog.tsx
│  │  │      project-details-sheet.tsx
│  │  │      projects-view.tsx
│  │  │      README.md
│  │  │      task-item.tsx
│  │  │
│  │  ├─contracts
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─components
│  │  │  │      change-order-item.tsx
│  │  │  │      contract-status-badge.tsx
│  │  │  │      contract-summary-card.tsx
│  │  │  │      index.ts
│  │  │  │      payment-progress.tsx
│  │  │  │      version-timeline.tsx
│  │  │  │
│  │  │  ├─constants
│  │  │  │      contract.constants.ts
│  │  │  │      index.ts
│  │  │  │      ui.constants.ts
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      contract-charts.tsx
│  │  │  │      contract-dashboard.tsx
│  │  │  │      contract-stats.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─dialogs
│  │  │  │      create-contract-dialog.tsx
│  │  │  │      delete-contract-dialog.tsx
│  │  │  │      edit-contract-dialog.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─forms
│  │  │  │      contract-form.tsx
│  │  │  │      create-contract-form.tsx
│  │  │  │      edit-contract-form.tsx
│  │  │  │      form-schemas.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─hooks
│  │  │  │      index.ts
│  │  │  │      use-contract-actions.ts
│  │  │  │      use-contract-form.ts
│  │  │  │      use-contracts.ts
│  │  │  │
│  │  │  ├─providers
│  │  │  │      contract-context.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─services
│  │  │  │      change-order.service.ts
│  │  │  │      contract.service.ts
│  │  │  │      export.service.ts
│  │  │  │      index.ts
│  │  │  │      payment.service.ts
│  │  │  │
│  │  │  ├─sheets
│  │  │  │      contract-details-sheet.tsx
│  │  │  │      contract-edit-sheet.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─tables
│  │  │  │      change-orders-table.tsx
│  │  │  │      contracts-table.tsx
│  │  │  │      index.ts
│  │  │  │      payments-table.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      change-order.types.ts
│  │  │  │      contract-version.types.ts
│  │  │  │      contract.types.ts
│  │  │  │      index.ts
│  │  │  │      payment.types.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      contract.utils.ts
│  │  │  │      index.ts
│  │  │  │      status.utils.ts
│  │  │  │      validation.utils.ts
│  │  │  │
│  │  │  └─views
│  │  │          contract-detail-view.tsx
│  │  │          contract-list-view.tsx
│  │  │          contracts-view.tsx
│  │  │          create-contract-view.tsx
│  │  │          index.ts
│  │  │
│  │  ├─dashboard
│  │  │      ai-usage-log.tsx
│  │  │      dashboard-stats.tsx
│  │  │      dashboard-view.tsx
│  │  │      README.md
│  │  │
│  │  ├─documents
│  │  │      documents-view.tsx
│  │  │      README.md
│  │  │      work-items-table.tsx
│  │  │
│  │  ├─partnerverse
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─compliance
│  │  │  │      compliance-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─contacts
│  │  │  │      contacts-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─contracts
│  │  │  │      contracts-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─dashboard
│  │  │  │      dashboard.tsx
│  │  │  │
│  │  │  ├─financials
│  │  │  │      financials-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─overview
│  │  │  │      overview-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─partners
│  │  │  │      partners-view.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─performance
│  │  │  │      performance-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  ├─transactions
│  │  │  │      transactions-tab.tsx
│  │  │  │      README.md
│  │  │  │
│  │  │  └─workflows
│  │  │          workflow-builder.tsx
│  │  │
│  │  ├─settings
│  │  │      settings-view.tsx
│  │  │
│  │  └─team
│  │      ├─knowledge-base
│  │      │      entry-form-dialog.tsx
│  │      │
│  │      ├─members
│  │      │      create-member-dialog.tsx
│  │      │      README.md
│  │      │
│  │      ├─schedule
│  │      │      README.md
│  │      │
│  │      └─skills
│  │              README.md
│  │              skill-form-dialog.tsx
│  │              skills-list.tsx
│  │
│  ├─layout
│  │  │  README.md
│  │  │
│  │  ├─core
│  │  │      app-header.tsx
│  │  │      app-provider.tsx
│  │  │      app-shell.tsx
│  │  │      theme-provider.tsx
│  │  │
│  │  ├─navigation
│  │  │      breadcrumb.tsx
│  │  │      navigation-menu-item.tsx
│  │  │      navigation-menu.tsx
│  │  │      unified-sidebar.tsx
│  │  │
│  │  └─shared
│  │          logo.tsx
│  │
│  └─ui
│          accordion.tsx
│          alert-dialog.tsx
│          alert.tsx
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
│          dialog.tsx
│          dropdown-menu.tsx
│          form.tsx
│          input.tsx
│          label.tsx
│          menubar.tsx
│          popover.tsx
│          progress.tsx
│          radio-group.tsx
│          scroll-area.tsx
│          select.tsx
│          separator.tsx
│          sheet.tsx
│          sidebar.tsx
│          skeleton.tsx
│          slider.tsx
│          switch.tsx
│          table.tsx
│          tabs.tsx
│          textarea.tsx
│          toast.tsx
│          toaster.tsx
│          tooltip.tsx
│
├─config
│      navigation.config.ts
│      README.md
│
├─context
│      ProjectContext.tsx
│      README.md
│
├─docs
│      database.md
│      README.md
│      structure.md
│
├─hooks
│      README.md
│      use-mobile.tsx
│      use-toast.ts
│
├─lib
│      firebase.ts
│      mongodb.ts
│      README.md
│      roles.ts
│      types.ts
│      utils.ts
│
├─models
│      ai-token-log.model.ts
│
├─services
│      logging.service.ts
│      README.md
│
└─utils
        date-picker.tsx
        README.md

    
