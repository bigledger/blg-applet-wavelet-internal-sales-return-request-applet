import { AppLoginPrincipalContainerModel, app_login_principal_RowClass, app_mst_grp_ext_RowClass, app_mst_grp_hdr_RowClass, app_mst_grp_line_RowClass, app_mst_link_grp_to_role_RowClass, app_mst_link_subject_to_grp_RowClass, app_mst_role_RowClass, bl_fi_mst_branch_ext_RowClass, bl_fi_mst_branch_RowClass, bl_fi_mst_item_hdr_RowClass, LinkSubjectToTeamContainerModel } from "blg-akaun-ts-lib";

export class SettlementSettingsModel {
    bl_fi_mst_branch: bl_fi_mst_branch_RowClass = new bl_fi_mst_branch_RowClass();
    bl_fi_mst_branch_exts: bl_fi_mst_branch_ext_RowClass[] = [];
    //app_mst_grp_lines: app_mst_grp_line_RowClass[] = [];
    num_settlement: number;
    created_by_name: string;
    updated_by_name: string;
}

export class SettlementMethodSettingsModel {
    bl_fi_mst_item_hdr: bl_fi_mst_item_hdr_RowClass = new bl_fi_mst_item_hdr_RowClass();
    //bl_fi_mst_branch_exts: bl_fi_mst_branch_ext_RowClass[] = [];
    //app_mst_grp_lines: app_mst_grp_line_RowClass[] = [];
    num_branch: number;
    created_by_name: string;
    updated_by_name: string;
}

// // information about the current user
// export class UserTeamModel {
//     // contains info about user mobile ID
//     app_login_principal_mobile: app_login_principal_RowClass = new app_login_principal_RowClass();
//     // contains info about user email ID
//     app_login_principal_email: app_login_principal_RowClass = new app_login_principal_RowClass();
//     // links to groups
//     link_subject_to_grps: app_mst_link_subject_to_grp_RowClass[] = [];
// }

// information about the members of the group
export class SettlementMethodModel {
    guid : string;
    fi_item_hdr_guid : string;
    code: string;
    name: string;
    cashbook: string;
    type: string;
    sort_code: string;
    fi_item: any;
}


export class SettlementGroupModel {
    type: string;
    method: SettlementMethodModel[]
}

// // information about a regular user
// export class UserModel {
//     // app login subject guid
//     app_login_subject_guid: string;
//     // contains info about user mobile ID
//     app_login_principal_mobile: app_login_principal_RowClass = new app_login_principal_RowClass();
//     // contains info about user email ID
//     app_login_principal_email: app_login_principal_RowClass = new app_login_principal_RowClass();
// }

// export class TeamRoleModel {
//     link_grp_to_role: app_mst_link_grp_to_role_RowClass = new app_mst_link_grp_to_role_RowClass();
//     app_mst_role: app_mst_role_RowClass = new app_mst_role_RowClass();
//     num_permissions: number;
// }