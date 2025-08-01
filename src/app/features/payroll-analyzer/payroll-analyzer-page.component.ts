import { Component } from '@angular/core';


// Importando os componentes filhos standalone
import { DatasetUploadComponent } from './components/dataset-upload.component';
import { PayrollAlertsComponent } from './components/payroll-alerts.component';
import {PayrollAlert} from '../../core/models/payroll-alert.model';
import {PayrollRecord} from '../../core/models/payroll-record.model';
import {PayrollAnalyzerService} from '../../core/services/payroll-analyzer.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-payroll-analyzer-page',
  standalone: true,
  templateUrl: './payroll-analyzer-page.component.html',
  styleUrls: ['./payroll-analyzer-page.component.scss'],
  imports: [DatasetUploadComponent, PayrollAlertsComponent,CommonModule]
})
export class PayrollAnalyzerPageComponent {
  payrollAlerts: PayrollAlert[] = [];
  lastPayrollData: PayrollRecord[] = [];

  constructor(private payrollAnalyzerService: PayrollAnalyzerService) {}

  onDatasetLoaded(dataset: PayrollRecord[]) {
    this.lastPayrollData = dataset;
    this.payrollAlerts = this.payrollAnalyzerService.analyzePayroll(dataset);
  }

  onReset() {
    this.lastPayrollData = [];
    this.payrollAlerts = [];
  }
}
