import { Injectable } from '@angular/core';
import { LocalizationFile, Group, StringItem } from '../models/localization-file.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class XmlLocalizationService {
  /**
   * Faz o parse de um XML string para um objeto LocalizationFile tipado.
   */
  parseXml(xmlString: string): Observable<LocalizationFile> {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      // Validação básica
      const localizationElem = xmlDoc.querySelector('localization');
      if (!localizationElem) return throwError(() => new Error('Arquivo XML sem tag <localization>'));

      // Extração de atributos principais
      const culture = localizationElem.getAttribute('culture') || '';
      const moduleId = localizationElem.getAttribute('moduleId') || '';

      // Função recursiva para parsear grupos
      const parseGroups = (groupNodes: NodeListOf<Element>): Group[] => {
        return Array.from(groupNodes).map((groupElem) => {
          const group: Group = {
            name: groupElem.getAttribute('name') || '',
            tags: groupElem.getAttribute('tags') || undefined,
            strings: [],
            groups: [],
          };
          // Strings do grupo
          group.strings = Array.from(groupElem.querySelectorAll(':scope > string')).map((stringElem) => ({
            key: stringElem.getAttribute('key') || '',
            value: stringElem.textContent || '',
          }));

          // Subgrupos (recursivo)
          const subGroups = groupElem.querySelectorAll(':scope > group');
          group.groups = subGroups.length ? parseGroups(subGroups) : [];

          return group;
        });
      };

      const groupNodes = localizationElem.querySelectorAll(':scope > group');
      const groups = parseGroups(groupNodes);

      const result: LocalizationFile = { culture, moduleId, groups };
      return of(result);
    } catch (err) {
      return throwError(() => new Error('Erro ao fazer parse do XML: ' + (err as Error).message));
    }
  }

  /**
   * Valida estrutura do LocalizationFile.
   */
  validateLocalizationFile(file: LocalizationFile): boolean {
    if (!file.culture || !file.moduleId) return false;
    if (!Array.isArray(file.groups) || file.groups.length === 0) return false;
    // (Validação recursiva dos grupos)
    const validateGroups = (groups: Group[]): boolean => {
      return groups.every((g) =>
        !!g.name &&
        Array.isArray(g.strings) &&
        g.strings.every((s) => !!s.key)
        && (!g.groups || validateGroups(g.groups))
      );
    };
    return validateGroups(file.groups);
  }

  /**
   * Exporta objeto LocalizationFile para string XML.
   */
  exportToXml(file: LocalizationFile): string {
    const createGroupXml = (group: Group): string => {
      const tagAttrs = [`name="${group.name}"`];
      if (group.tags) tagAttrs.push(`tags="${group.tags}"`);
      let inner = '';
      if (group.strings && group.strings.length) {
        inner += group.strings
          .map((str) => `<string key="${str.key}">${this.escapeXml(str.value)}</string>`)
          .join('');
      }
      if (group.groups && group.groups.length) {
        inner += group.groups.map(createGroupXml).join('');
      }
      return `<group ${tagAttrs.join(' ')}>${inner}</group>`;
    };

    const groupsXml = file.groups.map(createGroupXml).join('');
    return `<?xml version="1.0" encoding="utf-8"?>
<localization xmlns="http://nasajon.com/schemas/localization.xsd" culture="${file.culture}" moduleId="${file.moduleId}">
  ${groupsXml}
</localization>`;
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
