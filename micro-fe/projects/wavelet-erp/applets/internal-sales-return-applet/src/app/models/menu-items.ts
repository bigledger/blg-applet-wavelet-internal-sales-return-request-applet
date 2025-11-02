export const menuItems = [
  {
    state: '',
    name: sessionStorage.getItem('tenantCode'),
    type: 'tenant',
    icon: 'https'
  },
  {
    state: 'internal-sales-return',
    name: 'Internal Sales Return',
    type: 'link',
    icon: 'request_page',
  },
  {
    state: `line-items`,
    name: 'Line Items',
    type: 'link',
    icon: 'list',
  },
  {
    state: `intercompany`,
    name: 'Intercompany',
    type: 'link',
    icon: 'compare_arrows',
  },
  {
    state: 'file-export',
    name: 'File Export',
    type: 'link',
    icon: 'list_alt',
  },
  {
    state: `file-import`,
    name: 'File Import',
    type: 'link',
    icon: 'upload',
  },
];
export const settingItems = [
  {
    group: 'System Configuration',
    child: [
      {
        state: 'field-settings',
        name: 'Application Settings'
      },
      {
        state: 'default-selection',
        name: 'Default Selection'
      },
      {
        state: 'printable-format-settings',
        name: 'Printable Format Settings'
      },
      {
        state: 'return-reasons-settings',
        name: 'Return Reasons Settings'
      },
      {
        state: 'branch-settings',
        name: 'Branch Settings'
      },
      {
        state: 'workflow-settings',
        name: 'Workflow Settings'
      },
    ]
  }
]

export const personalizationItems = [
  {
    group: 'System Configuration',
    child: [
      // {
      //   state: 'field-settings',
      //   name: 'Field Settings'
      // },
      {
        state: 'personal-default-selection',
        name: 'Default Selection'
      },
    ]
  }
];
