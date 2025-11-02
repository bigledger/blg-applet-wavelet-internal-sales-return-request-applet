export const menuItems = [
  {
    state: '',
    name: sessionStorage.getItem('tenantCode'),
    type: 'tenant',
    icon: 'https'
  },
  {
    state: `sales-return`,
    name: 'Sales Return',
    type: 'link',
    icon: 'list_alt',
  },
  {
    state: `line-items`,
    name: 'Line Items',
    type: 'link',
    icon: 'list_alt',
  }
];

export const settingItems = [
  {
    group: 'System Configuration',
    child: [
      {
        state: 'field-settings',
        name: 'Field Settings'
      },
      {
        state: 'default-selection',
        name: 'Default Selection'
      },
      {
        state: 'printable-format-settings',
        name: 'Printable Format Settings'
      },
    ]
  }
]

export const personalizationItems = [
  {
    group: 'System Configuration',
    child: [
      {
        state: 'field-settings',
        name: 'Field Settings'
      },
      {
        state: 'personal-default-selection',
        name: 'Default Selection'
      },
    ]
  }
];
