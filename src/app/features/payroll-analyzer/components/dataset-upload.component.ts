import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import {PayrollRecord} from '../../../core/models/payroll-record.model';
import {PayrollAnalyzerService} from '../../../core/services/payroll-analyzer.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dataset-upload',
  standalone: true,
  templateUrl: './dataset-upload.component.html',
  styleUrls: ['./dataset-upload.component.scss'],
  imports: [CommonModule]
})
export class DatasetUploadComponent implements OnDestroy {
  @Output() datasetLoaded = new EventEmitter<PayrollRecord[]>();

  uploadError: string | null = null;
  uploadSuccess: boolean = false;
  private uploadSub?: Subscription;

  constructor(private payrollAnalyzerService: PayrollAnalyzerService) {}

  onFileSelected(event: Event) {
    this.resetFeedback();

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.uploadError = 'Nenhum arquivo selecionado.';
      return;
    }
    const file = input.files[0];
    // Só aceita .csv ou .json
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      this.uploadError = 'Formato não suportado. Envie um arquivo .csv ou .json.';
      return;
    }

    this.uploadSub = this.payrollAnalyzerService.parseDataset(file).subscribe({
      next: (records) => {
        this.uploadSuccess = true;
        this.datasetLoaded.emit(records);
      },
      error: (err) => {
        this.uploadError = typeof err === 'string' ? err : (err?.message || 'Erro ao importar arquivo.');
        this.uploadSuccess = false;
      }
    });
  }

  resetFeedback() {
    this.uploadError = null;
    this.uploadSuccess = false;
  }

  ngOnDestroy() {
    this.uploadSub?.unsubscribe();
  }
}
