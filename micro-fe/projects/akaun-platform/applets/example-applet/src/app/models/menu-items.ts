export const menuItems = [
  {
    state: '',
    name: sessionStorage.getItem('tenantCode'),
    type: 'tenant',
    icon: 'https'
  },
  {
    state: 'company',
    name: 'Company',
    type: 'link',
    icon: 'class',
  },
  {
    state: 'generic',
    name: 'Generic Example',
    type: 'link',
    icon: 'class',
  },
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
