import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [

  {
    state: '',
    name: 'General',
    type: 'saperator',
    icon: 'av_timer'
  },
  {
    state: 'hostname-management-applet', name: 'Hostname',
    type: 'sub',
    icon: 'class',
    children: [
      {
        state: 'home',
        name: 'Manage Hostname',
        type: 'link'
      },
      {
        state: 'create-group-hostname',
        name: 'Add Hostname',
        type: 'link'
      }
    ]
  },
  // {
  //   state: 'team-management-applet', name: 'Team',
  //   type: 'sub',
  //   icon: 'people_outline',
  //   children: [
  //     {
  //       state: 'home',
  //       name: 'Manage Team',
  //       type: 'link'
  //     },
  //     {
  //       state: 'create-group-team',
  //       name: 'Add Team',
  //       type: 'link'
  //     }
  //   ]
  // },
  {
    state: 'app-store-applet', name: 'App Store',
    type: 'sub',
    icon: 'apps',
    children: [
      {
        state: 'home',
        name: 'App Store',
        type: 'link'
      },
      // {
      //   state: 'create-group-launchpad',
      //   name: 'Add Launchpad',
      //   type: 'link'
      // }
    ]
  },
  {
    state: 'launchpad-applet', name: 'Launchpad',
    type: 'sub',
    icon: 'bookmarks',
    children: [
      {
        state: 'container',
        name: 'Launchpad',
        type: 'link'
      },
      // {
      //   state: 'create-group-launchpad',
      //   name: 'Add Launchpad',
      //   type: 'link'
      // }
    ]
  },
  {
    state: 'group-maintenance-applet', name: 'Group',
    type: 'link',
    icon: 'people',
    // children: [
    //   {
    //     state: 'home',
    //     name: 'Manage Group',
    //     type: 'link'
    //   },
    //   {
    //     state: 'create-group-group',
    //     name: 'Add Group',
    //     type: 'link'
    //   }
    // ]
  },
  { state: 'catalogue-applet', name: 'Catalogue', type:'sub', icon: 'card_membership',
    children: [
      {
        state: 'home',
        name: 'Manage Catalogue',
        type: 'link'
      },
      {
        state: 'create-group-catalogue',
        name: 'Add Catalogue',
        type: 'link'
      }
    ]
  },
  { state: 'tenant-management-applet', name: 'Tenant', type:'sub', icon: 'account_balance',
    children: [
      {
        state: 'home',
        name: 'Manage Tenant',
        type: 'link'
      },
      {
        state: 'create-group-tenant',
        name: 'Add Tenant',
        type: 'link'
      }
    ]
  },
  { state: 'organisation-applet', name: 'Organisation Applet', type:'sub', icon: 'account_balance',
    children: [
      {
        state: 'company-create-group',
        name: 'Company',
        type: 'subchild',
        subchildren: [
          {
            state: 'companymanage',
            name: 'Manage Company',
            type: 'link'
          },
          {
            state: 'companylisting',
            name: 'Add Company',
            type: 'link'
          }
        ]
      },
      {
        state: 'branch',
        name: 'Branch',
        type: 'subchild',
        subchildren: [
          {
            state: 'branchmanage',
            name: 'Manage Branch',
            type: 'link'
          },
          {
            state: 'branchlisting',
            name: 'Add Branch',
            type: 'link'
          },

        ]
      },
      {
        state: 'location',
        name: 'Location',
        type: 'subchild',
        subchildren: [{
          state: 'locationmanage',
          name: 'Manage Location',
          type: 'link'
        },
          {
            state: 'locationlisting',
            name: 'Add Location',
            type: 'link'
          }
        ]
      }
    ]
  },
  {
    state: '',
    name: 'Celmonze',
    type: 'saperator',
    icon: 'av_timer'
  },
  {
    state: 'customer-profile-applet',
    name: 'Customer Profile',
    type: 'link',
    icon: 'lock',
    // children: [
    //   {state: 'create-group', name: 'Create', type: 'link'},
    //   {state: 'global-search', name: 'Global Search', type: 'link'},
    //   {state: 'search', name: 'Search', type: 'link'},
    //   {state: 'edit-customer-profile/:guid', name: 'Edit', type: 'link'}
    // ]
  }
  // {
  //   state: '',
  //   name: 'Authentication',
  //   type: 'saperator',
  //   icon: 'av_timer'
  // },
  // {
  //   state: 'auth',
  //   name: 'IAM',
  //   type: 'sub',
  //   icon: 'lock',
  //   children: [
  //     {state: 'login',name: 'Akaun Login', type: 'link'},
  //     {state: 'sign-up', name: 'Akaun Signup', type:'link'},
  //     {state: 'forgot-password', name:'Akaun Forgot Password', type:'link'},
  //     {state: 'send-verification-email', name: 'Akaun Verify Email', type:'link'},
  //   ]
  // },


];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
