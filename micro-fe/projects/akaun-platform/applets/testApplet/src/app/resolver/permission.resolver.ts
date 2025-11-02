import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { CompanyService, EntityService, LocationService, BranchService, AppletService, TeamService, TenantService, HostnameService } from "blg-akaun-ts-lib";

@Injectable({ providedIn: 'root' })
export class PermissionResolver implements Resolve<any> {
    constructor(
        private Company: CompanyService,
        private Entity: EntityService,
        private Location: LocationService,
        private Branch: BranchService,
        private Tenant: TenantService,
        private Applet: AppletService,
        private Team: TeamService,
        private Hostname: HostnameService
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        return this;
    }
    /**
    * Configure the default service based on the default target view name.
    * This target view name can be found in the target_options.target_hdr_table_view_name
    * in the app_perm_dfn table based on the permission you are configuring.
    */
    getService(defaultTargetViewName) {
        return this[defaultTargetViewName];
    }

    /**
     * Configure the column definitions of the AG grid based on the default target view name.
     */
    getColumnsDefs(defaultTargetViewName) {
        switch(defaultTargetViewName.toUpperCase()) { 
            case "Company".toUpperCase(): { 
                return this.createColumns([
                    ['Company Code', 'code'], 
                    ['Company Name', 'name']
                ])
            } 
            case "Branch".toUpperCase(): { 
                return this.createColumns([
                    ['Branch Code', 'code'], 
                    ['Branch Name', 'name']
                ])
            } case "Location".toUpperCase(): {
                return this.createColumns([
                    ['Location Code', 'code'], 
                    ['Location Name', 'name']
                ])
            } case "Entity".toUpperCase(): {
                return this.createColumns([
                    ['Entity Code', 'code'], 
                    ['Entity Name', 'name']
                ])
            } case "Applet".toUpperCase(): {
                return this.createColumns([
                    ['Applet Code', 'code'], 
                    ['Applet Name', 'name']
                ])
            } case "Tenant".toUpperCase(): {
                return this.createColumns([
                    ['Tenant Code', 'code'], 
                    ['Tenant Name', 'name']
                ])
            } case "Team".toUpperCase(): {
                return this.createColumns([
                    ['Team Code', 'code'], 
                    ['Team Name', 'name']
                ])
            } case "Hostname".toUpperCase(): {
                return this.createColumns([
                    ['Hostname Type', 'hostname_type'], 
                    ['Hostname Value', 'hostname_value'], 
                    ['Hostname URL', 'hostname_url']
                ])
            }
            default: { 
                return []
            } 
        }
    }
    
    getViewField(defaultTargetViewName) {
        switch(defaultTargetViewName.toUpperCase()) { 
            case "Company".toUpperCase(): { 
                return 'name';
            } 
            case "Branch".toUpperCase(): { 
                return 'name';
            } case "Location".toUpperCase(): {
                return 'name';
            } case "Entity".toUpperCase(): {
                return 'name';
            } case "Applet".toUpperCase(): {
                return 'name';
            } case "Tenant".toUpperCase(): {
                return 'name';
            } case "Team".toUpperCase(): {
                return 'name';
            } case "Hostname".toUpperCase(): {
                return 'hostname_value';
            }
            default: { 
                return '';
            } 
        }
    }
    
    /**
     * Create columns. Field is the name of the container and the field you are trying to access, i.e.,
     * 'bl_fi_mst_comp.code'.
     * 
     * @param columns : an object containing an array of tuples that species [header name, field]
     */
    createColumns(columns: [string, string][]) {
        const cols = []
        columns.forEach(x => {
            const obj = {
                headerName: x[0],
                field: x[1],
                cellStyle: {textAlign: 'left'}
            }
            if (cols.length == 0) {
                // checkbox selection is only true for the first column
                cols.push({...obj, checkboxSelection: true})
            } else {
                cols.push(obj)
            }
        })
        return cols;
    }
}