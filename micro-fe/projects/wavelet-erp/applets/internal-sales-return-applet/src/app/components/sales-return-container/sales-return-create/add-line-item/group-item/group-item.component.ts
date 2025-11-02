import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ItemAttributeChildLinkService, Pagination, ItemAttributeChildLinkContainerModel } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { GroupInputTextCellRendererComponent } from './input-text-cell-renderer/input-text-cell-renderer.component';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { Store } from '@ngrx/store';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-line-item-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class LineItemGroupItemComponent implements OnInit, OnDestroy {
  @Input() itemHdr: any;
  @Input() mode: string;
  @Input() lineItem;
  protected subs = new SubSink();
  gridApi;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };
  frameworkComponents = {
    groupItemCellRenderer: GroupInputTextCellRendererComponent
  };

  columnDefs = [];
  columnHdr: any = [];
  rowData = [];
  rowDataFlat = [];
  defaultAttribute1;
  defaultAttribute2;
  defaultAttribute3;
  pagination = new Pagination();

  itemAttributeChildLinkContainerModels: ItemAttributeChildLinkContainerModel[];

  groupedAttributeJson;
  totalEnteredQty = 0;
  itemGuid;
  itemCode;
  private lastGuidCsv: string | null = null;
  constructor(
    private itemAttrChildLinkService: ItemAttributeChildLinkService,
    private store: Store<InternalSalesReturnStates>,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectChildItems).subscribe(data => {
      const guids = (data || []).map(item => item?.guid).filter(Boolean);
      const guidCsv = guids.join(',');

      // Skip re-fetch and re-render if the GUID set hasn't changed
      if (this.lastGuidCsv === guidCsv) {
        return;
      }
      this.lastGuidCsv = guidCsv;
      if (!guidCsv) {
        return;
      }

      this.pagination.conditionalCriteria = [
        { columnName: "calcTotalRecords", operator: "=", value: "true" },
        {
          columnName: "fi_item_line_guids",
          operator: "=",
          value: guidCsv,
        }
      ];
      this.subs.sink = this.itemAttrChildLinkService
        .getByCriteria(this.pagination, AppConfig.apiVisa).subscribe(attributeLinks => {
          this.itemAttributeChildLinkContainerModels = attributeLinks.data;
          this.itemGuid = this.itemHdr.guid;
          this.itemCode = this.itemHdr.code;
          this.computeDefaultAttributesFromSequence();
          this.setTableHeader();
          this.cdRef.detectChanges();
        });
    }
    );

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectChildItems).subscribe(data => {
      this.totalEnteredQty = data.reduce((sum, lineItem) => sum + (lineItem?.enteredQty || 0), 0);
    });
  }

  autoGroupColumnDef = {
    headerName: 'Attribute 2 / 3',
    width: 250,
    cellRendererParams: {
      suppressCount: true
    }
  };


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  getDataPath = (data: any) => data.hierarchy;

  // Determine default attributes (1/2/3) by ascending sequence_no per unique attribute_hdr_guid
  computeDefaultAttributesFromSequence() {
    const links = (this.itemAttributeChildLinkContainerModels || [])
      .map(m => m?.bl_fi_mst_item_attribute_child_link)
      .filter(Boolean);

    // Map attribute_hdr_guid -> smallest sequence_no seen
    const minSeqByHdr = new Map<string, number>();
    links.forEach(l => {
      const guid = l?.attribute_hdr_guid?.toString();
      const seq = Number(l?.sequence_no);
      if (!guid) return;
      const current = minSeqByHdr.get(guid);
      const normalizedSeq = Number.isFinite(seq) ? seq : Number.POSITIVE_INFINITY;
      if (current === undefined || normalizedSeq < current) {
        minSeqByHdr.set(guid, normalizedSeq);
      }
    });

    const sortedGuids = Array.from(minSeqByHdr.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([guid]) => guid);

    this.defaultAttribute1 = sortedGuids?.[0];
    this.defaultAttribute2 = sortedGuids?.[1];
    this.defaultAttribute3 = sortedGuids?.[2];
  }

  setTableHeader() {
    this.pagination.offset = 0;
    this.pagination.limit = 1000;

    const attribute1Links = (this.itemAttributeChildLinkContainerModels || [])
      .filter(link => link.bl_fi_mst_item_attribute_child_link.attribute_hdr_guid === this.defaultAttribute1)
      .filter((link, index, self) =>
        index === self.findIndex(l =>
          l.bl_fi_mst_item_attribute_child_link.value_string === link.bl_fi_mst_item_attribute_child_link.value_string
        )
      );

    const parentHeader = {
      headerName: attribute1Links?.[0]?.bl_fi_mst_item_attribute_child_link?.attribute_name?.toString() || 'Attribute 1',
      children: attribute1Links.map(col => ({
        field: this.removeSpaces(col.bl_fi_mst_item_attribute_child_link.value_string?.toString()),
        headerValueGetter: () => col.bl_fi_mst_item_attribute_child_link.value_string?.toString(),
        cellRenderer: 'groupItemCellRenderer',
        cellRendererParams: (params) => ({
          headerName: col.bl_fi_mst_item_attribute_child_link.attribute_name.toString(),
          headerGuid: col.bl_fi_mst_item_attribute_child_link.attribute_hdr_guid,
          headerCode: col.bl_fi_mst_item_attribute_child_link.attribute_code?.toString(),
          headerValueOption: col.bl_fi_mst_item_attribute_child_link.value_string?.toString(),
          mode: this.mode,
          childItemJson: this.lineItem?.item_child_json,
          attributeLinks: this.itemAttributeChildLinkContainerModels,
          parentCode: this.itemCode
        }),
        suppressSizeToFit: true,
        editable: false,
      }))
    };

    // Combine static and dynamic column definitions
    this.columnDefs = [parentHeader];

    // Set the new column definitions to the grid
    this.gridApi.setColumnDefs(this.columnDefs);
    this.setGridData();
  }

  setGridData() {
    const attribute2Links = (this.itemAttributeChildLinkContainerModels || [])
      .filter(links => links.bl_fi_mst_item_attribute_child_link.attribute_hdr_guid === this.defaultAttribute2);
    if (this.defaultAttribute3 !== null && this.defaultAttribute3 !== undefined) {
      const attribute3Links = (this.itemAttributeChildLinkContainerModels || [])
        .filter(links => links.bl_fi_mst_item_attribute_child_link.attribute_hdr_guid === this.defaultAttribute3);
      this.updateAutoGroupHeaderName(attribute2Links, attribute3Links);
      this.handleThreeAttribute(attribute2Links, attribute3Links);
    } else {
      this.updateAutoGroupHeaderName(attribute2Links);
      this.handleTwoAttribute(attribute2Links);
    }
  }

  private updateAutoGroupHeaderName(
    attribute2Links: ItemAttributeChildLinkContainerModel[],
    attribute3Links?: ItemAttributeChildLinkContainerModel[]
  ) {
    const attr2Name = attribute2Links?.[0]?.bl_fi_mst_item_attribute_child_link?.attribute_name?.toString() || 'Attribute 2';
    const attr3Name = attribute3Links?.[0]?.bl_fi_mst_item_attribute_child_link?.attribute_name?.toString() || 'Attribute 3';
    const header = attribute3Links ? `${attr2Name} / ${attr3Name}` : attr2Name;
    this.autoGroupColumnDef = { ...this.autoGroupColumnDef, headerName: header };
  }

  handleThreeAttribute(attributeLinks2: ItemAttributeChildLinkContainerModel[], attributeLinks3: ItemAttributeChildLinkContainerModel[]) {
    let rowDataFlat = [];
    attributeLinks2.forEach(link2 => {
      attributeLinks3.forEach(link3 => {
        const rowData = {
          hierarchy: [link2.bl_fi_mst_item_attribute_child_link.value_string, link3.bl_fi_mst_item_attribute_child_link.value_string],
          attributeCode2: link2.bl_fi_mst_item_attribute_child_link.attribute_code,
          attributeCode3: link3.bl_fi_mst_item_attribute_child_link.attribute_code,
          attributeValueOption2: link2.bl_fi_mst_item_attribute_child_link.value_string,
          attributeValueOption3: link3.bl_fi_mst_item_attribute_child_link.value_string
        }
        rowDataFlat.push(rowData);
        this.rowDataFlat = rowDataFlat;
      })
    })
  }

  handleTwoAttribute(attributeLinks2: ItemAttributeChildLinkContainerModel[]) {
    let rowDataFlat = [];
    attributeLinks2.forEach(link2 => {
      const rowData = {
        hierarchy: [link2.bl_fi_mst_item_attribute_child_link.value_string],
        attributeCode2: link2.bl_fi_mst_item_attribute_child_link.attribute_code,
        attributeValueOption2: link2.bl_fi_mst_item_attribute_child_link.value_string,
        onlyTwoAttribute: true
      }
      rowDataFlat.push(rowData);
      this.rowDataFlat = rowDataFlat;
    })
  }


  removeSpaces(str: string) {
    return str ? str.replace(/\s/g, '') : str;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
