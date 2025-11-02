import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { Store } from '@ngrx/store';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';
import { FinancialItemContainerModel, FinancialItemService, TaxCodeContainerModel } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from 'projects/shared-utilities/visa';

@Component({
  selector: 'app-edit-item-details-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
})
export class EditLineItemDetailsMainComponent extends ViewColumnComponent {

  protected subs = new SubSink();  

  item$: Observable<FinancialItemContainerModel>;
  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;

  constructor(
    protected readonly store: Store<LineItemStates>,
    protected fiService: FinancialItemService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      // For gen doc link 
      hdrGuid: new FormControl(),
      serverDocTypeHdr: new FormControl(),
      lineGuid: new FormControl(),
      serverDocTypeLine: new FormControl(),
      orderNo: new FormControl(),
      orderQty: new FormControl(),
      itemType: new FormControl(),
      itemGuid: new FormControl(),
      itemCode: new FormControl(),
      itemName: new FormControl(),

      uom: new FormControl(),
      pricingScheme: new FormControl(),

      qty: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
      qtyUom: new FormControl(),
      uomBaseRatio: new FormControl(),
      unitPriceUom: new FormControl(),
      unitDiscountUom: new FormControl(), 
      unitPrice: new FormControl('0.00', Validators.compose([Validators.required, Validators.min(0.01)])),
      unitDiscount: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      discountAmt: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      stdAmt: new FormControl('0.00', Validators.compose([Validators.min(0.01)])),
      netAmt1: new FormControl('0.00', Validators.compose([Validators.required, Validators.min(0.01)])),
      taxCode: new FormControl(''),
      taxPercent: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      taxAmt: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      netAmt2: new FormControl('0.00', Validators.compose([Validators.required, Validators.min(0.01)])),
      whtCode: new FormControl(''),
      whtPercent: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      whtAmt: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      txnAmt: new FormControl('0.00', Validators.compose([Validators.required, Validators.min(0.01)])),
      remarks: new FormControl(),
      itemTxnType: new FormControl()
    });
    this.form.controls['uom'].disable();
    this.form.controls['pricingScheme'].disable();
    
    this.subs.sink = this.store.select(LineItemSelectors.selectLineItem).subscribe({ next: (resolve: any) => {
      if (resolve) {
        this.form.patchValue({
          hdrGuid: resolve.item_property_json?.hdrGuid,
          serverDocTypeHdr: resolve.item_property_json?.serverDocTypeHdr,
          lineGuid: resolve.item_property_json?.lineGuid,
          serverDocTypeLine: resolve.item_property_json?.serverDocTypeLine,
          orderNo: resolve.item_property_json?.orderNo,
          orderQty: resolve.item_property_json?.orderQty,
          itemGuid: resolve.item_property_json?.itemGuid,
          itemCode: resolve.item_property_json?.itemCode,
          itemName: resolve.item_property_json?.itemName,
          itemType: resolve.item_property_json?.itemType,

          uom: resolve.item_property_json?.uom,
          pricingScheme: resolve.item_property_json?.pricingScheme,

          qtyUom: resolve.item_property_json?.qtyUom,
          uomBaseRatio: resolve.item_property_json?.uomBaseRatio, 
          unitPriceUom: resolve.item_property_json.unitPriceUom ? parseFloat(resolve.item_property_json?.unitPriceUom).toFixed(2) : null,
          unitDiscountUom: resolve.item_property_json.unitDiscountUom ? parseFloat(resolve.item_property_json.unitDiscountUom).toFixed(2) : null,
          qty: resolve.quantity_base,
          unitPrice: resolve.item_property_json.unitPrice ? parseFloat(resolve.item_property_json.unitPrice).toFixed(2) : null,
          unitDiscount: resolve.item_property_json.unitDiscount ? parseFloat(resolve.item_property_json.unitDiscount).toFixed(2) : null,
          discountAmt: resolve.amount_discount ? parseFloat(resolve.amount_discount).toFixed(2) : null,
          stdAmt: resolve.amount_std ? parseFloat(resolve.amount_std).toFixed(2) : null,
          netAmt1: resolve.amount_net ? parseFloat(resolve.amount_net).toFixed(2) : null,
          taxCode: resolve.item_property_json?.taxCode,
          taxPercent: resolve.tax_gst_rate ? parseFloat(resolve.tax_gst_rate).toFixed(2) : null,
          taxAmt: resolve.amount_tax_gst ? parseFloat(resolve.amount_tax_gst).toFixed(2) : null,
          netAmt2: resolve.item_property_json.netAmt2 ? parseFloat(resolve.item_property_json.netAmt2).toFixed(2) : null,
          whtCode: resolve.item_property_json?.whtCode,
          whtPercent: resolve.tax_wht_rate ? parseFloat(resolve.tax_wht_rate).toFixed(2) : null,
          whtAmt: resolve.amount_tax_wht ? parseFloat(resolve.amount_tax_wht).toFixed(2) : null,
          txnAmt: resolve.amount_txn ? parseFloat(resolve.amount_txn).toFixed(2) : null,
          remarks: resolve.item_remarks,
          itemTxnType: resolve?.item_txn_type,
        });
      }
    }});
    this.item$ = this.fiService.getByGuid(this.form.value.itemGuid, this.apiVisa).pipe(
      map(a => a.data)
    )
  }

  onCalculate() {
    const quantity = parseInt(this.form.controls['qty'].value, 10); // user input
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value); // user input
    const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value); // user input
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value); // user input 
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value); // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    if (uomBaseRatio) {
      const qtyByUom = this.roundToTwo(quantity / uomBaseRatio) 
      this.form.controls['qtyUom'].setValue(qtyByUom);
    }

    const discountAmount = quantity * unitDiscount;
    const stdAmount = quantity * unitPrice;
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // 100 * 0.06 = 6 NEED TO ROUND   
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // 100 * 0.05 = 5 NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount 

    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromUnitPrice() {
    const quantity = parseInt(this.form.controls['qty'].value, 10); 
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value); // user input
    const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value); 
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value); 
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value); 
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);
    // const unitPriceUom = parseFloat(this.form.controls['unitPriceUom'].value);

    if (uomBaseRatio) {
      const unitPriceUom = this.roundToTwo(unitPrice * uomBaseRatio);
      this.form.controls['unitPriceUom'].setValue(unitPriceUom.toFixed(2));
    }
    
    const discountAmount = quantity * unitDiscount;
    const stdAmount = quantity * unitPrice;
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // 100 * 0.06 = 6 NEED TO ROUND   
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // 100 * 0.05 = 5 NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount 

    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromUnitDisc() {
    const quantity = parseInt(this.form.controls['qty'].value, 10); 
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value); 
    const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value); // user input
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value); 
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value); 
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    if (uomBaseRatio) {
      const unitDiscountUom = this.roundToTwo(unitDiscount * uomBaseRatio) 
      this.form.controls['unitDiscountUom'].setValue(unitDiscountUom.toFixed(2));
    }

    const discountAmount = quantity * unitDiscount;
    const stdAmount = quantity * unitPrice;
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // 100 * 0.06 = 6 NEED TO ROUND   
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // 100 * 0.05 = 5 NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount 

    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromAmountDisc() {
    const quantity = parseInt(this.form.controls['qty'].value, 10);
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value);
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
    const discountAmount = parseFloat(this.form.controls['discountAmt'].value) // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    if (uomBaseRatio) {
      const unitDiscountUom = this.roundToTwo((discountAmount * uomBaseRatio) / quantity);
      this.form.controls['unitDiscountUom'].setValue(unitDiscountUom.toFixed(2));
    }

    const stdAmount = quantity * unitPrice;
    const unitDiscount = this.roundToTwo(discountAmount / quantity) // backward calc NEED TO ROUND
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // NEED TO ROUND
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // NEED TO ROUND
    const txnAmount =  netAmount2 - whtAmount // 106 - 5 = 101

    this.form.controls['unitDiscount'].setValue(unitDiscount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromAmountStd() {
    const quantity = parseInt(this.form.controls['qty'].value, 10);
    const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value);
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
    const stdAmount = parseFloat(this.form.controls['stdAmt'].value) // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    if (uomBaseRatio) {
      const unitPriceUom = this.roundToTwo((stdAmount * uomBaseRatio) / quantity);
      this.form.controls['unitPriceUom'].setValue(unitPriceUom.toFixed(2));
    }

    const unitPrice = this.roundToTwo(stdAmount / quantity); // backward calc
    const discountAmount = quantity * unitDiscount;
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // NEED TO ROUND
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount // 106 - 5 = 101

    this.form.controls['unitPrice'].setValue(unitPrice.toFixed(2));
    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromAmountNet() {
    const quantity = parseInt(this.form.controls['qty'].value, 10);
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value);
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
    const netAmount1 = parseFloat(this.form.controls['netAmt1'].value); // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    if (uomBaseRatio) {
      const unitDiscountUom = this.roundToTwo((unitPrice * uomBaseRatio) - ((netAmount1 * uomBaseRatio) / quantity));
      this.form.controls['unitDiscountUom'].setValue(unitDiscountUom.toFixed(2));
    } 

    const stdAmount = quantity * unitPrice;
    const unitDiscount = this.roundToTwo(unitPrice - (netAmount1 / quantity)); // backward calc 
    const discountAmount = stdAmount - netAmount1 // backward calc
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // 100 * 0.06 = 6 NEED TO ROUND
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // 100 * 0.05 = 5 NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount // 106 - 5 = 101

    this.form.controls['unitDiscount'].setValue(unitDiscount.toFixed(2));
    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromAmountTxn() {
    const quantity = parseInt(this.form.controls['qty'].value, 10);
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value);
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
    const txnAmount =  parseFloat(this.form.controls['txnAmt'].value); // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    const stdAmount = quantity * unitPrice;
    const netAmount1 = this.roundToTwo(txnAmount / (1 + taxPercent - whtPercent)); // backward calc ? round here?
    const taxAmount = this.roundToTwo((txnAmount / (1 + taxPercent - whtPercent)) * taxPercent);
    const netAmount2 = this.roundToTwo((txnAmount + (txnAmount * taxPercent)) / (1 + taxPercent - whtPercent));
    const whtAmount = this.roundToTwo((txnAmount / (1 + taxPercent - whtPercent)) * whtPercent);

    // const discountAmount = this.roundToTwo(stdAmount - (txnAmount - taxAmount + whtAmount)); // backward calc round here?
    // const unitDiscount = unitPrice - this.roundToTwo((txnAmount - taxAmount + whtAmount) / quantity); // backward calc round here?
    const discountAmount = this.roundToTwo(stdAmount - (txnAmount / (1 + taxPercent - whtPercent)));
    const unitDiscount = this.roundToTwo(unitPrice - (txnAmount / ((1 + taxPercent - whtPercent) * quantity)));

    // should use proper equation for this? 
    if (uomBaseRatio) {
      const unitDiscountUom = unitDiscount * uomBaseRatio
      this.form.controls['unitDiscountUom'].setValue(unitDiscountUom.toFixed(2));
    }
  
    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['unitDiscount'].setValue(unitDiscount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
  }

  onCalculateFromQtyByUom() {
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);
    const qtyByUom = parseFloat(this.form.controls['qtyUom'].value) // user input
    if (uomBaseRatio) {
      const qty = Math.round(qtyByUom * uomBaseRatio)
      this.form.controls['qty'].setValue(qty);
      this.onCalculate();
    }
  }

  onCalculateFromUomBaseRatio() {
    const quantity = parseInt(this.form.controls['qty'].value, 10); 
    const unitPrice = parseFloat(this.form.controls['unitPrice'].value); 
    const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value); 
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);  
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value); 
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10); // user input

    const qtyByUom = this.roundToTwo(quantity / uomBaseRatio);
    const unitDiscountUom = this.roundToTwo(unitDiscount * uomBaseRatio);
    const unitPriceUom = this.roundToTwo(unitPrice * uomBaseRatio);
    this.form.controls['qtyUom'].setValue(qtyByUom);
    this.form.controls['unitDiscountUom'].setValue(unitDiscountUom.toFixed(2));
    this.form.controls['unitPriceUom'].setValue(unitPriceUom.toFixed(2));
  
    const discountAmount = quantity * unitDiscount;
    const stdAmount = quantity * unitPrice;
    const netAmount1 = stdAmount - discountAmount // apply tax or wht calculations on this
    const taxAmount = this.roundToTwo(netAmount1 * taxPercent); // 100 * 0.06 = 6 NEED TO ROUND   
    const netAmount2 = netAmount1 + taxAmount; // 100 + 6 = 106
    const whtAmount = this.roundToTwo(netAmount1 * whtPercent); // 100 * 0.05 = 5 NEED TO ROUND HERE
    const txnAmount =  netAmount2 - whtAmount 

    this.form.controls['discountAmt'].setValue(discountAmount.toFixed(2));
    this.form.controls['stdAmt'].setValue(stdAmount.toFixed(2));
    this.form.controls['netAmt1'].setValue(netAmount1.toFixed(2));
    this.form.controls['taxAmt'].setValue(taxAmount.toFixed(2));
    this.form.controls['netAmt2'].setValue(netAmount2.toFixed(2));
    this.form.controls['whtAmt'].setValue(whtAmount.toFixed(2));
    this.form.controls['txnAmt'].setValue(txnAmount.toFixed(2));
  }

  onCalculateFromUnitPriceUom() {
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);
    const unitPriceUom = parseFloat(this.form.controls['unitPriceUom'].value); // user input
    if (uomBaseRatio) {
      const unitPrice = this.roundToTwo(unitPriceUom / uomBaseRatio);
      this.form.controls['unitPrice'].setValue(unitPrice.toFixed(2));
      this.onCalculate();
    }    
  }

  onCalculateFromUnitDiscountUom() {
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);
    const unitDiscountUom= parseFloat(this.form.controls['unitDiscountUom'].value); // user input
    if (uomBaseRatio) {
      const unitDiscount = this.roundToTwo(unitDiscountUom / uomBaseRatio);
      this.form.controls['unitDiscount'].setValue(unitDiscount.toFixed(2));
      this.onCalculate();
    }    
  }

  nullHandler(controlName: string, value: string) {
    if (controlName === 'qty' || controlName === 'uomBaseRatio' || controlName === 'qtyUom') 
      value ? this.form.controls[controlName].setValue(value) : this.form.controls[controlName].setValue(1);
    else 
      value ? this.form.controls[controlName].setValue(parseFloat(value).toFixed(2)) : this.form.controls[controlName].setValue('0.00');
  }

  onSST(e: TaxCodeContainerModel) {
    this.form.controls['taxPercent'].setValue(
      (parseFloat(e.bl_fi_cfg_tax_code.tax_rate_txn.toString())).toFixed(2)
    );
    this.onCalculate();
  }

  onWHT(e: TaxCodeContainerModel) {
    this.form.controls['whtPercent'].setValue(
      (parseFloat(e.bl_fi_cfg_tax_code.tax_rate_txn.toString())).toFixed(2)
    );
    this.onCalculate();
  }

  onUOMSelected(e: number) {
    this.form.controls['uomBaseRatio'].patchValue(e);
  }

  roundToTwo(num) {    
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}