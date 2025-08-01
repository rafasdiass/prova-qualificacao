import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import {LocalizationFile} from '../../../../core/models/localization-file.model';
import {XmlLocalizationService} from '../../../../core/services/xml-localization.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-xml-upload',
  standalone: true,
  templateUrl: './xml-upload.component.html',
  styleUrls: ['./xml-upload.component.scss'],
  imports: [CommonModule]
})
export class XmlUploadComponent implements OnDestroy {
  @Output() xmlLoaded = new EventEmitter<LocalizationFile>();

  uploadError: string | null = null;
  uploadSuccess: boolean = false;
  private uploadSub?: Subscription;

  constructor(private xmlService: XmlLocalizationService) {}

  onFileSelected(event: Event) {
    this.resetFeedback();

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.uploadError = 'Nenhum arquivo selecionado.';
      return;
    }
    const file = input.files[0];
    if (!file.name.endsWith('.xml')) {
      this.uploadError = 'Formato não suportado. Envie um arquivo .xml.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const xmlString = reader.result as string;
      this.uploadSub = this.xmlService.parseXml(xmlString).subscribe({
        next: (localizationFile) => {
          this.uploadSuccess = true;
          this.xmlLoaded.emit(localizationFile);
        },
        error: (err) => {
          this.uploadError = typeof err === 'string' ? err : (err?.message || 'Erro ao importar arquivo XML.');
          this.uploadSuccess = false;
        }
      });
    };
    reader.onerror = () => {
      this.uploadError = 'Erro ao ler o arquivo.';
    };
    reader.readAsText(file);
  }

  resetFeedback() {
    this.uploadError = null;
    this.uploadSuccess = false;
  }

  ngOnDestroy() {
    this.uploadSub?.unsubscribe();
  }
}
