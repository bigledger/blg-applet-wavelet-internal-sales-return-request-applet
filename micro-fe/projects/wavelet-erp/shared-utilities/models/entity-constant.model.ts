export class ARAPTypeOptions {
  public static values: Option[] = [
    { value: 'AR_TRADE', viewValue: 'AR_TRADE' },
    { value: 'AR_OTHER', viewValue: 'AR_OTHER' },
    { value: 'AR_MERCHANT', viewValue: 'AR_MERCHANT' },
    { value: 'AP_TRADE', viewValue: 'AP_TRADE' },
    { value: 'AP_OTHER', viewValue: 'AP_OTHER' },
    { value: 'AP_MERCHANT', viewValue: 'AP_MERCHANT' },
    { value: 'AP_EMPLOYEE', viewValue: 'AP_EMPLOYEE' }
  ];
}

interface Option {
  value: string;
  viewValue: string;
}