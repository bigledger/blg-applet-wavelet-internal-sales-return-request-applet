import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { bl_fi_generic_doc_hdr_RowClass } from "blg-akaun-ts-lib";
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';

@Component ({
    selector: 'app-sales-return-posting',
    templateUrl: './posting.component.html',
    styleUrls: ['./posting.component.scss']
})
export class PostingComponent implements OnInit, OnDestroy {

    @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

    @Output() updatePosting = new EventEmitter();

    private subs = new SubSink();

    public form: FormGroup;

    constructor() { }

    ngOnInit(): void {
        this.form = new FormGroup({
            journalStatus: new FormControl(),
            inventoryStatus: new FormControl(),
            membershipStatus: new FormControl(),
            cashbookStatus: new FormControl(),
            taxStatus: new FormControl()
        });
        this.subs.sink = this.draft$.subscribe({
            next: (resolve: any) => {
                this.form.patchValue({
                    journalStatus: resolve.posting_journal,
                    inventoryStatus: resolve.posting_inventory,
                    membershipStatus: resolve.posting_membership,
                    cashbookStatus: resolve.posting_cashbook,
                    taxStatus: resolve.posting_tax_gst
                });
            }
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    
}