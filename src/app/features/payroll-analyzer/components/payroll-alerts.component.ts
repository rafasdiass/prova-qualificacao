import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {PayrollAlert} from '../../../core/models/payroll-alert.model';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-payroll-alerts',
  standalone: true,
  templateUrl: './payroll-alerts.component.html',
  styleUrls: ['./payroll-alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PayrollAlertsComponent {
  @Input() alerts: PayrollAlert[] = [];

  get hasAlerts(): boolean {
    return this.alerts && this.alerts.length > 0;
  }
}
