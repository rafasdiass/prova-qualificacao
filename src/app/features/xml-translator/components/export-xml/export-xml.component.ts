import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LocalizationFile } from '../../../../core/models/localization-file.model';
import { XmlLocalizationService } from '../../../../core/services/xml-localization.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-export-xml',
  standalone: true,
  templateUrl: './export-xml.component.html',
  styleUrls: ['./export-xml.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ExportXmlComponent {
  @Input() localizationFile!: LocalizationFile | null;
  exportError: string | null = null;
  exportSuccess: boolean = false;

  constructor(private xmlService: XmlLocalizationService) {}

  onExportXml() {
    this.exportError = null;
    this.exportSuccess = false;
    if (!this.localizationFile) {
      this.exportError = 'Nenhum arquivo de localização carregado.';
      return;
    }
    try {
      const xmlString = this.xmlService.exportToXml(this.localizationFile);
      this.downloadFile(xmlString, 'localization-pt.xml');
      this.exportSuccess = true;
    } catch (err: any) {
      this.exportError = err?.message || 'Erro ao exportar XML.';
    }
  }

  private downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  }
}
