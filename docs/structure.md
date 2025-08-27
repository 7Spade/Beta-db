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
│  │  README.md
│  │
│  ├─(admin)
│  │  │  layout.tsx
│  │  │
│  │  ├─blog-management
│  │  │  └─posts
│  │  │      │  page.tsx
│  │  │      │
│  │  │      └─[id]
│  │  │              page.tsx
│  │  │
│  │  ├─career-management
│  │  │  │  page.tsx
│  │  │  │
│  │  │  ├─applications
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─jobs
│  │  │          page.tsx
│  │  │
│  │  ├─contact-management
│  │  │      page.tsx
│  │  │
│  │  ├─content-management
│  │  │  │  page.tsx
│  │  │  │
│  │  │  ├─media
│  │  │  │      page.tsx
│  │  │  │
│  │  │  └─pages
│  │  │          page.tsx
│  │  │
│  │  ├─dashboard-management
│  │  │      page.tsx
│  │  │
│  │  ├─system-management
│  │  │      page.tsx
│  │  │
│  │  └─user-management
│  │          page.tsx
│  │
│  ├─(auth)
│  │  │  layout.tsx
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
│  ├─(dashboard)
│  │  │  layout.tsx
│  │  │  README.md
│  │  │
│  │  ├─cloud-drive
│  │  │      page.tsx
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
│  │  ├─docu-parse
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
│  ├─features
│  │  │  index.ts
│  │  │  README.md
│  │  │
│  │  ├─admin
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      user-actions.ts
│  │  │  │
│  │  │  └─views
│  │  │          admin-dashboard-view.tsx
│  │  │          user-management-view.tsx
│  │  │
│  │  ├─app
│  │  │      ai-subtask-suggestions.tsx
│  │  │      create-project-dialog.tsx
│  │  │      project-details-sheet.tsx
│  │  │      projects-view.tsx
│  │  │      README.md
│  │  │      task-item.tsx
│  │  │
│  │  ├─auth
│  │  │      auth-actions.ts
│  │  │      auth-form-schemas.ts
│  │  │      auth-provider.tsx
│  │  │      auth.config.ts
│  │  │      auth.utils.ts
│  │  │      index.ts
│  │  │      login-view.tsx
│  │  │      profile-view.tsx
│  │  │      public-profile-view.tsx
│  │  │      register-view.tsx
│  │  │      social-auth-buttons.tsx
│  │  │      use-auth.ts
│  │  │
│  │  ├─blog
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      posts.actions.ts
│  │  │  │
│  │  │  └─views
│  │  │          post-form-view.tsx
│  │  │          posts-list-view.tsx
│  │  │
│  │  ├─cloud-drive
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
│  │  ├─docu-parse
│  │  │  │  index.ts
│  │  │  │  README.md
│  │  │  │
│  │  │  ├─actions
│  │  │  │      docu-parse-actions.ts
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
│  │  ├─storage-manager
│  │  │  └─components
│  │  │          storage-item-card.tsx
│  │  │
│  │  └─team
│  │      │  index.ts
│  │      │
│  │      ├─knowledge-base
│  │      │  │  entry-form-dialog.tsx
│  │      │  │  page.tsx
│  │      │  │
│  │      │  └─actions
│  │      │          index.ts
│  │      │          knowledge-actions.ts
│  │      │          types.ts
│  │      │
│  │      ├─members
│  │      │      create-member-dialog.tsx
│  │      │      page.tsx
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
│          context-menu.tsx
│          dialog.tsx
│          dropdown-menu.tsx
│          form.tsx
│          input.tsx
│          label.tsx
│          menubar.tsx
│          popover.tsx
│          progress.tsx
│          radio-group.tsx
│          README.md
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
│
├─hooks
│      README.md
│      use-mobile.tsx
│      use-toast.ts
│
├─lib
│  │  firebase-admin.ts
│  │  firebase-client.ts
│  │  mongodb.ts
│  │  README.md
│  │  types.ts
│  │  utils.ts
│  │
│  ├─services
│  │  │  README.md
│  │  │
│  │  ├─contracts
│  │  │      contract-api.service.ts
│  │  │      contract-cache.service.ts
│  │  │      firebase-contract.service.ts
│  │  │      index.ts
│  │  │      README.md
│  │  │
│  │  └─firebase
│  │          auth.service.ts
│  │          firestore.service.ts
│  │          functions.service.ts
│  │          index.ts
│  │          README.md
│  │          storage.service.ts
│  │
│  └─types
│      │  README.md
│      │
│      ├─contracts
│      │      change-order.types.ts
│      │      contract-version.types.ts
│      │      contract.types.ts
│      │      index.ts
│      │      payment.types.ts
│      │      README.md
│      │
│      └─firebase
│              auth.types.ts
│              firestore.types.ts
│              functions.types.ts
│              index.ts
│              README.md
│              storage.types.ts
│
├─models
│      ai-token-log.model.ts
│      README.md
│
├─services
│      logging.service.ts
│      README.md
│
└─utils
        date-picker.tsx
        README.md