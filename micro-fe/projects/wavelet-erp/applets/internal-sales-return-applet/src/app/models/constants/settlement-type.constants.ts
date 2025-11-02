export class SettlementTypeOptions {
  public static values: Option[] = [
    { value: 'BANK_TRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CASH', viewValue: 'Cash' },
    { value: 'CHEQUE', viewValue: 'Cheque' },
    { value: 'POST_DATED_CHEQUE', viewValue: 'Post Dated Cheque' },
    { value: 'CREDIT_CARD', viewValue: 'Credit Card' },
    { value: 'DEBIT_CARD', viewValue: 'Debit Card' },
    { value: 'E_WALLET', viewValue: 'e-Wallet' },
    { value: 'FPX_EMANDATE', viewValue: 'FPX e-Mandate' },
    { value: 'MEMBERSHIP_POINT_CURRENCY', viewValue: 'Membership Point Currency' },
    { value: 'OPEN_CREDIT', viewValue: 'Open Credit' },
    { value: 'OTHERS', viewValue: 'Others' },
    { value: 'PGW_MERCHANT', viewValue: 'PGW Merchant' },
    { value: 'PGW_PROVIDER_SEAMLESS', viewValue: 'PGW Provider Seamless' },
    { value: 'VOUCHER', viewValue: 'Voucher' },
    { value: 'TT_PAYMENT', viewValue: 'TT Payment' }
  ];
}
interface Option {
  value: string;
  viewValue: string;
}