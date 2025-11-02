import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { bl_fi_mst_item_line_RowClass, FinancialItemContainerModel } from 'blg-akaun-ts-lib';
import { Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink2';

interface PricingScheme {
  uom_guid: string;
  label_guid: string;
  price_name: string;
  price_amount: number;
}

@Component({
  selector: 'app-pricing-scheme',
  templateUrl: './pricing-scheme.component.html',
  styleUrls: ['./pricing-scheme.component.scss']
})
export class PricingSchemeComponent implements OnInit, OnDestroy {

  @Input() uom: FormControl;
  @Input() pricingScheme: FormControl;
  @Input() item$: Observable<FinancialItemContainerModel>;

  @Output() uomChange = new EventEmitter<FormControl>();
  @Output() pricingSchemeChange = new EventEmitter<FormControl>();
  @Output() uomToBaseRatio = new EventEmitter<number>();
  @Output() unitPriceByUOM = new EventEmitter<number>();

  private subs = new SubSink();

  uomfilterControl = new FormControl();
  pricingSchemefilterControl = new FormControl();
  filteredUOM$: ReplaySubject<bl_fi_mst_item_line_RowClass[]> = new ReplaySubject<bl_fi_mst_item_line_RowClass[]>(1);
  filteredPricingScheme$: ReplaySubject<PricingScheme[]> = new ReplaySubject<PricingScheme[]>(1);
  uomList: bl_fi_mst_item_line_RowClass[];
  pricingSchemeList: bl_fi_mst_item_line_RowClass[];

  constructor() {}

  // TODO: Optimize on the memory consumption
  ngOnInit() {
    this.subs.sink = this.item$.subscribe(
      {next: resolve => {
        const baseUOM = <bl_fi_mst_item_line_RowClass>{
          ...resolve.bl_fi_mst_item_lines[0],
          guid: '0',
          uom: resolve.bl_fi_mst_item_hdr.uom,
          quantity: 1
        };
        this.uomList = [
          baseUOM, ...resolve.bl_fi_mst_item_lines.filter(l => l.uom)];
        this.pricingSchemeList = resolve.bl_fi_mst_item_lines.filter(l => l.uom);
        this.filteredUOM$.next(this.uomList);
        this.pricingScheme.reset();
        this.pricingScheme.disable();
        // this.filteredPricingScheme$.next(this.pricingSchemeList);
      }});
    this.subs.sink = this.pricingSchemefilterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterPricingScheme(resolve)});
    this.subs.sink = this.uomfilterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterUOM(resolve)});
  }

  filterPricingScheme(search: string) {
    const pricingScheme = this.pricingSchemeList.filter(l =>
      l.uom === this.uom.value
    ).map(l => (<any>l.property_json)?.item_uom_pricing).flat();
    if (!search) {
      this.filteredPricingScheme$.next(pricingScheme);
    } else {
      search = search.toLowerCase();
      const filter = pricingScheme.filter(price =>
        `${price.price_name}: ${price.price_amount.toString()}`.toLowerCase().includes(search));
      this.filteredPricingScheme$.next(filter);
    }
  }

  filterUOM(search: string) {
    if (!search) {
      this.filteredUOM$.next(this.uomList);
    } else {
      search = search.toLowerCase();
      const filter = this.uomList.filter(l =>
        l.uom.toLowerCase().includes(search));
      this.filteredUOM$.next(filter);
    }
  }

  onUOMSelected(e: string) {
    if (e === '0') {
      this.pricingScheme.disable();
    }
    const pricingScheme = this.pricingSchemeList.filter(l => l.guid === e).map(l => (<any>l.property_json)?.item_uom_pricing).flat();
    if (pricingScheme.every(p => p)) {
      this.filteredPricingScheme$.next(pricingScheme);
      this.pricingScheme.reset();
      this.pricingScheme.enable();
    }
    const ratio = parseFloat(this.uomList.find(l => l.guid.toString() === e).quantity.toString());
    this.uomToBaseRatio.emit(ratio);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
