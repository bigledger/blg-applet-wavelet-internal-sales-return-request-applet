import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { AppletService, BatchHdrService, BranchService, CompanyService, CustomerService, DimensionService, EmployeeService, EntityService, FinancialItemService, HostnameService, IdentityTokenService, LocationService, MembershipCardService, PrintableFormatListService, PrintableFormatService, ProfitCenterService, ProjectCoaService, SegmentCoaService, TeamService, TenantService } from "blg-akaun-ts-lib";

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
        private Hostname: HostnameService,
        private financial_item: FinancialItemService,
        private login_subject: IdentityTokenService,
        private Batch: BatchHdrService,
        private MemebershipCard: MembershipCardService,
        private profitCenter: ProfitCenterService,
        private Customer: CustomerService,
        private Employee: EmployeeService,
        private printableFormat: PrintableFormatService,
        private printableFormatList: PrintableFormatListService,
        private Dimension: DimensionService,
        private dgmktSegment: SegmentCoaService,
        private Project: ProjectCoaService
        
    ) { }

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
        if(defaultTargetViewName == 'Company'){
				return this.Company;
		}
		if(defaultTargetViewName == 'Branch'){
				return this.Branch;
		}
        if(defaultTargetViewName == 'Location'){
            return this.Location;
        }
        if(defaultTargetViewName == 'Entity'){
				return this.Entity;
		}
        if(defaultTargetViewName == 'Applet'){
            return this.Applet;
        }
        if(defaultTargetViewName == 'Tenant'){
				return this.Tenant;
		}
        if(defaultTargetViewName == 'Team'){
            return this.Team;
        }
        if(defaultTargetViewName == 'Hostname'){
            return this.Hostname;
        }
        if(defaultTargetViewName == 'financial_item'){
            return this.financial_item;
        }
        if(defaultTargetViewName == 'login_subject'){
            return this.login_subject;
        }
        if(defaultTargetViewName == 'Batch'){
            return this.Batch;
        }
        if(defaultTargetViewName == 'Membership Card'){
            return this.MemebershipCard;
        }
        if(defaultTargetViewName == 'Profit Center'){
            return this.profitCenter;
        }
        if(defaultTargetViewName == 'Customer'){
            return this.Customer;
        }
        if(defaultTargetViewName == 'Employee'){
            return this.Employee;
        }
        if(defaultTargetViewName == 'Printable Format'){
            return this.printableFormat;
        }
        if(defaultTargetViewName == 'Printable Format List'){
            return this.printableFormatList;
        }
        if(defaultTargetViewName == 'Dimension'){
            return this.Dimension;
        }
        if(defaultTargetViewName == 'Segment'){
            return this.dgmktSegment;
        }
        if(defaultTargetViewName == 'Project'){
            return this.Project;
        }

    }

    /**
     * Configure the column definitions of the AG grid based on the default target view name.
     */
    getColumnsDefs(defaultTargetViewName) {
        switch (defaultTargetViewName.toUpperCase()) {
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
            }
            case "Hostname".toUpperCase(): {
                return this.createColumns([
                    ['Hostname Type', 'hostname_type'],
                    ['Hostname Value', 'hostname_value'],
                    ['Hostname URL', 'hostname_url']
                ])
            }
            case "financial_item".toUpperCase(): {
                return this.createColumns([
                    ['Item Code', 'code'],
                    ['Item Name', 'name']
                ])
            }
            case "login_subject".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Batch".toUpperCase(): {
                return this.createColumns([
                    ['Batch No', 'batch_no'],
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Membership Card".toUpperCase(): {
                return this.createColumns([
                    ['Card No', 'card_no'],
                    ['Name', 'name']
                ])
            }
            case "Profit Center".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Customer".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'customer_code'],
                    ['Name', 'name']
                ])
            }
            case "Employee".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'employee_code'],
                    ['Name', 'name']
                ])
            }
            case "Printable Format".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Printable Format List".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Dimension".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Segment".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            case "Project".toUpperCase(): {
                return this.createColumns([
                    ['Code', 'code'],
                    ['Name', 'name']
                ])
            }
            default: {
                return []
            }
        }
    }

    getViewField(defaultTargetViewName) {
        switch (defaultTargetViewName.toUpperCase()) {
            case "Company".toUpperCase(): {
                return 'name';
            }
            case "Branch".toUpperCase(): {
                return 'name';
            } 
            case "Location".toUpperCase(): {
                return 'name';
            } 
            case "Entity".toUpperCase(): {
                return 'name';
            } 
            case "Applet".toUpperCase(): {
                return 'name';
            } 
            case "Tenant".toUpperCase(): {
                return 'name';
            } 
            case "Team".toUpperCase(): {
                return 'name';
            }
            case "Hostname".toUpperCase(): {
                return 'hostname_value';
            }
            case "financial_item".toUpperCase(): {
                return 'name';
            }
            case "login_subject".toUpperCase(): {
                return 'name';
            }
            case "Batch".toUpperCase(): {
                return 'name';
            }
            case "Membership Card".toUpperCase(): {
                return 'name';
            }
            case "Profit Center".toUpperCase(): {
                return 'name';
            }
            case "Customer".toUpperCase(): {
                return 'name';
            }
            case "Employee".toUpperCase(): {
                return 'name';
            }
            case "Printable Format".toUpperCase(): {
                return 'name';
            }
            case "Printable Format List".toUpperCase(): {
                return 'name';
            }
            case "Dimension".toUpperCase(): {
                return 'name';
            }
            case "Segment".toUpperCase(): {
                return 'name';
            }
            case "Project".toUpperCase(): {
                return 'name';
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
                cellStyle: { textAlign: 'left' }
            }
            if (cols.length == 0) {
                // checkbox selection is only true for the first column
                cols.push({ ...obj, checkboxSelection: true })
            } else {
                cols.push(obj)
            }
        })
        return cols;
    }
}
