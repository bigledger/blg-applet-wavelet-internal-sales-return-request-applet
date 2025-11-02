import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiResponseModel,
  ApiVisa, Core2Config, GenericDocSearchCriteriaDtoModel, Pagination
} from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { ViewColumnFacade } from '../facades/view-column.facade';


@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly url = Core2Config.DOMAIN_URL + Core2Config.TENANT_URL_PREFIX + Core2Config.DOMAIN_PREFIX + Core2Config.INV_PREFIX + 'serial-numbers';

  protected apiUrl: string;
  protected api_domain_url: string;
  protected endpoint_path: string;

  protected httpClient: HttpClient;

  constructor(http: HttpClient,
    protected viewColFacade: ViewColumnFacade,
  ) {
    this.apiUrl = this.url;
    this.endpoint_path = Core2Config.TENANT_URL_PREFIX + Core2Config.DOMAIN_PREFIX + Core2Config.INV_PREFIX + 'serial-numbers';
    this.httpClient = http;
  }

  public getHttpHeaderBlob(apiVisa: ApiVisa, params?: HttpParams) {
    const httpOptions = {
      headers: new HttpHeaders({
        authorization: apiVisa.jwt_secret,
        responseType: 'blob',
        tenantCode: apiVisa.tenantCode
      }),
      params: params,
      responseType: 'blob' as 'json'
    };
    return httpOptions;
  }

  public getHttpHeader(apiVisa: ApiVisa) {
    apiVisa.applet_code = apiVisa.applet_code ? apiVisa.applet_code : 'none';
    apiVisa.tenantCode = apiVisa.tenantCode ? apiVisa.tenantCode : '';

    const httpOptions = {
      headers: new HttpHeaders({
        authorization: apiVisa.jwt_secret,
        tenantCode: apiVisa.tenantCode, /// this will be removed in the future
        appId: apiVisa.applet_code, /// this will be removed in the future
      })
    };

    return httpOptions;
  }

  public printEinvoiceFromCompanyPrintable(guid: any, printableFormatHdrGuid: string, apiVisa: ApiVisa){
    let url = Core2Config.DOMAIN_URL + Core2Config.TENANT_DOMAIN_URL_PREFIX + Core2Config.ERP_PREFIX +  'fi/e-invoice/to-irbs/company-print-jasper-pdf';
    let eppath = Core2Config.TENANT_DOMAIN_URL_PREFIX + Core2Config.ERP_PREFIX + 'fi/e-invoice/to-irbs/company-print-jasper-pdf';
    if (eppath&& apiVisa.api_domain_url) {
      url = apiVisa.api_domain_url + eppath;
    }

    const UrlByCriteria =
    url +"/"+ guid +"?printableFormatHdrGuid="+printableFormatHdrGuid;
    let params;
    return this.httpClient.get<Blob>(
      UrlByCriteria,
      this.getHttpHeaderBlob(apiVisa, params)
    );
  }

  public contraMulti(container: any, apiVisa: ApiVisa): Observable<ApiResponseModel<any>> {
    let url = Core2Config.DOMAIN_URL + Core2Config.TENANT_URL_PREFIX + Core2Config.DOMAIN_PREFIX + Core2Config.ERP_PREFIX + 'gen-doc/arap-contras/multi/backoffice-ep';
    let ep = Core2Config.TENANT_DOMAIN_URL_PREFIX +  Core2Config.ERP_PREFIX + 'gen-doc/arap-contras/multi/backoffice-ep';
    if (ep && apiVisa.api_domain_url) {
      url = apiVisa.api_domain_url + ep;
    }

    return this.httpClient.post<ApiResponseModel<any>>(
      url,
      container,
      this.getHttpHeader(apiVisa)
    );
  }
}
