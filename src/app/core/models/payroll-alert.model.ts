import {PayrollRecord} from './payroll-record.model';

export interface PayrollAlert {
  type: 'RENDIMENTO_ATIPICO' | 'DESCONTO_VARIACAO';
  message: string;
  record: PayrollRecord;
}
