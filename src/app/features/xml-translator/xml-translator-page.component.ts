import { Component } from '@angular/core';


// Importando os componentes filhos standalone
import { XmlUploadComponent } from './components/xml-upload/xml-upload.component';
import { TranslationTableComponent } from './components/translation-table/translation-table.component';
import { ExportXmlComponent } from './components/export-xml/export-xml.component';
import {LocalizationFile} from '../../core/models/localization-file.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-xml-translator-page',
  standalone: true,
  templateUrl: './xml-translator-page.component.html',
  styleUrls: ['./xml-translator-page.component.scss'],
  imports: [
    XmlUploadComponent,
    TranslationTableComponent,
    ExportXmlComponent,
    CommonModule
  ]
})
export class XmlTranslatorPageComponent {
  localizationFile: LocalizationFile | null = null;

  onXmlLoaded(file: LocalizationFile) {
    this.localizationFile = file;
  }

  onLocalizationFileChanged(file: LocalizationFile) {
    this.localizationFile = file;
  }

  onReset() {
    this.localizationFile = null;
  }
}
