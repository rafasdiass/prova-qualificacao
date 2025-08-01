import { Routes } from '@angular/router';
import {XmlTranslatorPageComponent} from './features/xml-translator/xml-translator-page.component';
import {PayrollAnalyzerPageComponent} from './features/payroll-analyzer/payroll-analyzer-page.component';

// Importação dos componentes de página standalone


export const routes: Routes = [
  { path: 'xml-translator', component: XmlTranslatorPageComponent },
  { path: 'payroll-analyzer', component: PayrollAnalyzerPageComponent },
  { path: '', redirectTo: 'xml-translator', pathMatch: 'full' },
  { path: '**', redirectTo: 'xml-translator' }
];
