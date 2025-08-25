├─ai
│  │  dev.ts
│  │  genkit.ts
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
│  │
│  ├─(admin)
│  │      README.md
│  │
│  ├─(auth)
│  │  │  layout.tsx
│  │  │  page.tsx
│  │  │
│  │  ├─login
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
│  ├─(dashboard)
│  │  │  layout.tsx
│  │  │  README.md
│  │  │
│  │  ├─contracts
│  │  │  │  layout.tsx
│  │  │  │  page.tsx
│  │  │  │
│  │  │  ├─create
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─[id]
│  │  │          page.tsx
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
│  │  ├─quick-actions
│  │  │  ├─daily-report
│  │  │  │      page.tsx
│  │  │  │
│  │  │  ├─project-progress
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─staff-attendance
│  │  │          page.tsx
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
│  └─(public)
│          README.md
│
├─components
│  ├─features
│  │  ├─app
│  │  │      ai-subtask-suggestions.tsx
│  │  │      create-project-dialog.tsx
│  │  │      project-details-sheet.tsx
│  │  │      projects-view.tsx
│  │  │      README.md
│  │  │      task-item.tsx
│  │  │
│  │  ├─auth
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      auth-actions.ts
│  │  │  │      index.ts
│  │  │  │      MIGRATION.md
│  │  │  │      README.md
│  │  │  │      types.ts
│  │  │  │
│  │  │  ├─components
│  │  │  │      auth-form.tsx
│  │  │  │      auth-provider.tsx
│  │  │  │      index.ts
│  │  │  │      login-form.tsx
│  │  │  │      register-form.tsx
│  │  │  │      reset-password-form.tsx
│  │  │  │      social-auth-buttons.tsx
│  │  │  │      user-profile.tsx
│  │  │  │
│  │  │  ├─constants
│  │  │  │      auth.constants.ts
│  │  │  │      index.ts
│  │  │  │      ui.constants.ts
│  │  │  │
│  │  │  ├─dialogs
│  │  │  │      forgot-password-dialog.tsx
│  │  │  │      index.ts
│  │  │  │      login-dialog.tsx
│  │  │  │      register-dialog.tsx
│  │  │  │
│  │  │  ├─forms
│  │  │  │      auth-form-schemas.ts
│  │  │  │      index.ts
│  │  │  │      login-form.tsx
│  │  │  │      profile-form.tsx
│  │  │  │      register-form.tsx
│  │  │  │      reset-password-form.tsx
│  │  │  │
│  │  │  ├─hooks
│  │  │  │      index.ts
│  │  │  │      use-auth-form.ts
│  │  │  │      use-auth-state.ts
│  │  │  │      use-auth.ts
│  │  │  │
│  │  │  ├─providers
│  │  │  │      auth-context.tsx
│  │  │  │      auth-provider.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─services
│  │  │  │      auth-cache.service.ts
│  │  │  │      auth.service.ts
│  │  │  │      firebase-auth.service.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─sheets
│  │  │  │      auth-sheet.tsx
│  │  │  │      index.ts
│  │  │  │      profile-sheet.tsx
│  │  │  │
│  │  │  ├─types
│  │  │  │      auth-provider.types.ts
│  │  │  │      auth.types.ts
│  │  │  │      index.ts
│  │  │  │      user.types.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      auth-helpers.ts
│  │  │  │      auth.utils.ts
│  │  │  │      index.ts
│  │  │  │      validation.utils.ts
│  │  │  │
│  │  │  └─views
│  │  │          auth-view.tsx
│  │  │          index.ts
│  │  │          login-view.tsx
│  │  │          profile-view.tsx
│  │  │          register-view.tsx
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
│  │  │  │      dashboard.tsx
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
│  │  │      dashboard.tsx
│  │  │      README.md
│  │  │
│  │  ├─documents
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      document-actions.ts
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
│  │  │  │      document.types.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─utils
│  │  │  │      export.utils.ts
│  │  │  │      index.ts
│  │  │  │
│  │  │  └─views
│  │  │          documents-view.tsx
│  │  │
│  │  ├─partnerverse
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
│  │  │  │  │  partner-list.tsx
│  │  │  │  │  partner-profile.tsx
│  │  │  │  │  partners-view.tsx
│  │  │  │  │  README.md
│  │  │  │  │
│  │  │  │  ├─forms
│  │  │  │  │      contact-form.tsx
│  │  │  │  │      partner-form.tsx
│  │  │  │  │
│  │  │  │  ├─list
│  │  │  │  │      partner-list.tsx
│  │  │  │  │
│  │  │  │  └─profile
│  │  │  │          partner-profile.tsx
│  │  │  │          profile-header.tsx
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
│  │  │          optimization-assistant.tsx
│  │  │          workflow-builder.tsx
│  │  │
│  │  ├─quick-actions
│  │  │  ├─daily-report
│  │  │  │      daily-report-view.tsx
│  │  │  │      index.ts
│  │  │  │
│  │  │  ├─project-progress
│  │  │  │      index.ts
│  │  │  │      project-progress-view.tsx
│  │  │  │
│  │  │  └─staff-attendance
│  │  │          index.ts
│  │  │          staff-attendance-view.tsx
│  │  │
│  │  ├─settings
│  │  │      settings-view.tsx
│  │  │
│  │  └─team
│  │      │  index.ts
│  │      │
│  │      ├─knowledge-base
│  │      │  │  entry-form-dialog.tsx
│  │      │  │
│  │      │  └─actions
│  │      │          index.ts
│  │      │          knowledge-actions.ts
│  │      │          types.ts
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
│  │  │  index.ts
│  │  │  README.md
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
│  │  firebase.ts
│  │  mongodb.ts
│  │  README.md
│  │  roles.ts
│  │  types.ts
│  │  utils.ts
│  │
│  ├─config
│  │      auth.config.ts
│  │      firebase.config.ts
│  │      firestore.config.ts
│  │      functions.config.ts
│  │      index.ts
│  │      storage.config.ts
│  │
│  ├─hooks
│  │      index.ts
│  │      use-auth.ts
│  │      use-firestore.ts
│  │      use-functions.ts
│  │      use-storage.ts
│  │
│  ├─services
│  │  ├─auth
│  │  │      auth-api.service.ts
│  │  │      auth-cache.service.ts
│  │  │      firebase-auth.service.ts
│  │  │      index.ts
│  │  │
│  │  ├─contracts
│  │  │      contract-api.service.ts
│  │  │      contract-cache.service.ts
│  │  │      firebase-contract.service.ts
│  │  │      index.ts
│  │  │
│  │  └─firebase
│  │          auth.service.ts
│  │          firestore.service.ts
│  │          functions.service.ts
│  │          index.ts
│  │          storage.service.ts
│  │
│  ├─types
│  │  ├─auth
│  │  │      auth-provider.types.ts
│  │  │      auth.types.ts
│  │  │      index.ts
│  │  │      user.types.ts
│  │  │
│  │  ├─contracts
│  │  │      change-order.types.ts
│  │  │      contract-version.types.ts
│  │  │      contract.types.ts
│  │  │      index.ts
│  │  │      payment.types.ts
│  │  │
│  │  └─firebase
│  │          auth.types.ts
│  │          firestore.types.ts
│  │          functions.types.ts
│  │          index.ts
│  │          storage.types.ts
│  │
│  └─utils
│          auth.utils.ts
│          firestore.utils.ts
│          index.ts
│          storage.utils.ts
│          validation.utils.ts
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
