import { Component, EventEmitter, HostListener, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { InternalSalesReturnSelectors } from '../../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { isNullOrEmpty } from 'blg-akaun-ts-lib';

@Component({
  selector: 'app-group-input-text-cell-renderer',
  templateUrl: "./input-text-cell-renderer.component.html",
  styleUrls: ["./input-text-cell-renderer.component.css"],
})
export class GroupInputTextCellRendererComponent implements AfterViewInit {
  protected subs = new SubSink();
  params: any;
  displayValue: string = '0';
  disabled: boolean = false;
  @ViewChild('inputField') inputField: ElementRef;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter();
  childItem = [];
  showInputBox: boolean = true;

  constructor(private store: Store<InternalSalesReturnStates>) {}

  ngAfterViewInit(): void {
    this.updateInputFieldValue();
  }

  agInit(params: any): void {
    this.params = params;
    let processedAttribute = false;

    if(!this.params?.data?.onlyTwoAttribute && isNullOrEmpty(this.params?.data?.attributeCode3)) {
      this.showInputBox = false;
    }

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectChildItems).subscribe(data => {
      this.childItem = data
      if (this.childItem.length > 0 && !processedAttribute) {
        this.processAttributes();
        processedAttribute = true;
      }
    }
    );
  }

  processAttributes(): void {
    const attribute3Code = this.params?.data?.attributeCode3;
    const attribute2Code = this.params?.data?.attributeCode2;
    const attribute1Code = this.params?.headerCode;
    const parentCode = this.params?.parentCode;

    const headerValueOption = this.params?.headerValueOption;
    const attributeValueOption2 = this.params?.data?.attributeValueOption2;
    const attributeValueOption3 = this.params?.data?.attributeValueOption3;

    const result = this.findMatchingChildItemUsingGuidMatch(attribute1Code, attribute2Code, attribute3Code, headerValueOption, attributeValueOption2, attributeValueOption3);
    if (result) {
      this.disabled = false;
      if (this.params.mode === 'edit') {
        this.handleSelectedChild(result);
      }
    } else {
      this.disabled = true;
      this.displayValue = '0';
      this.updateInputFieldValue();
    }
  }

  findMatchingChildItemUsingGuidMatch(
    attribute1Code: string,
    attribute2Code: string,
    attribute3Code: string,
    attribute1ValueOption: string,
    attribute2ValueOption: string,
    attribute3ValueOption: string
  ): any {
    const links: any[] = Array.isArray(this.params?.attributeLinks) ? this.params.attributeLinks : [];
    if (!links.length) return null;

    const norm = (v: any) => (v ?? '').toString().trim();
    const a1 = norm(attribute1Code);
    const a2 = norm(attribute2Code);
    const a3 = norm(attribute3Code);
    const v1 = norm(attribute1ValueOption);
    const v2 = norm(attribute2ValueOption);
    const v3 = norm(attribute3ValueOption);

    const inner = (l: any) => l?.bl_fi_mst_item_attribute_child_link;
    const guidOf = (l: any): string | undefined => {
      const i = inner(l);
      const g = norm(i?.fi_item_line_guid);
      return g || undefined;
    };
    const matches = (l: any, code: string, val: string) => {
      const i = inner(l);
      return norm(i?.attribute_code) === code && norm(i?.value_string) === val;
    };

    const makeSet = (pred: (l: any) => boolean) => new Set(links.filter(pred).map(guidOf).filter(Boolean));

    let inter: Set<string> | null = null;
    if (a1 && v1) inter = makeSet(l => matches(l, a1, v1));
    if (a2 && v2) inter = inter ? new Set([...inter].filter(x => makeSet(l => matches(l, a2, v2)).has(x))) : makeSet(l => matches(l, a2, v2));
    if (a3 && v3) inter = inter ? new Set([...inter].filter(x => makeSet(l => matches(l, a3, v3)).has(x))) : makeSet(l => matches(l, a3, v3));

    const matchedLineItemGuid = inter && inter.size ? Array.from(inter)[0] : undefined;

    return matchedLineItemGuid ? this.childItem.find((item: any) => norm(item?.guid) === norm(matchedLineItemGuid)) : null;
  }

  handleSelectedChild(result): void {
    const selectedChild = this.params.childItemJson?.childItems.find(i => i.item_guid === result.item_hdr_guid);

    if (selectedChild && selectedChild.quantity_base > 0) {
      this.setDisplayValue(selectedChild.quantity_base);
      const updatedResult = { ...result, enteredQty: selectedChild.quantity_base };
      this.store.dispatch(InternalSalesReturnActions.updateChildItem({ child: updatedResult }));
    }
  }

  setDisplayValue(value: number): void {
    this.displayValue = isNaN(value) ? '0' : Math.abs(value).toFixed(0);
    this.updateInputFieldValue();
  }

  updateInputFieldValue(): void {
    if (this.inputField?.nativeElement) {
      this.inputField.nativeElement.value = this.displayValue;
    }
  }

  onInputChange(event: any): void {
    const numericValue = parseFloat(event.target.value.trim());
    this.processInputChange(numericValue);
  }

  processInputChange(numericValue: number): void {
    const attribute3Code = this.params.data?.attributeCode3;
    const attribute2Code = this.params.data.attributeCode2;
    const attribute1Code = this.params.headerCode;
    const parentCode = this.params.parentCode;

    const headerValueOption = this.params?.headerValueOption;
    const attributeValueOption2 = this.params?.data?.attributeValueOption2;
    const attributeValueOption3 = this.params?.data?.attributeValueOption3;

    const result = this.findMatchingChildItemUsingGuidMatch(attribute1Code, attribute2Code, attribute3Code, headerValueOption, attributeValueOption2, attributeValueOption3);

    if (result) {
      this.disabled = false;
      const updatedResult = { ...result, enteredQty: numericValue };
      this.store.dispatch(InternalSalesReturnActions.updateChildItem({ child: updatedResult }));
    }
    else {
      this.disabled = true;
      this.displayValue = '0';
    }

    this.params.data.qty = numericValue;
    this.setDisplayValue(numericValue);
  }

  onBlur(): void {
    this.updateInputFieldValue();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    //event.stopPropagation();
    console.log('onClick')
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault(); // Prevent default Enter key action
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    console.log('onDoubleClick')
    event.preventDefault();  // Prevent default double-click action
  }

}
