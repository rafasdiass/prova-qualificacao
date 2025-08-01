import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Group, LocalizationFile, StringItem } from '../../../../core/models/localization-file.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-translation-table',
  standalone: true,
  templateUrl: './translation-table.component.html',
  styleUrls: ['./translation-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class TranslationTableComponent {
  @Input() localizationFile!: LocalizationFile | null;
  @Output() localizationFileChanged = new EventEmitter<LocalizationFile>();

  /**
   * Captura input do usuário e chama alteração.
   */
  onStringInput(event: Event, groupPath: number[], strIndex: number) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    this.onStringChange(groupPath, strIndex, target.value);
  }

  /**
   * Manipula a alteração do valor de uma StringItem.
   * O uso explícito do tipo StringItem reforça a integridade de dados.
   */
  onStringChange(groupPath: number[], strIndex: number, value: string) {
    if (!this.localizationFile) return;
    // Cópia imutável do objeto
    const fileCopy: LocalizationFile = JSON.parse(JSON.stringify(this.localizationFile));
    let group: Group = fileCopy.groups[groupPath[0]];
    for (let i = 1; i < groupPath.length; i++) {
      group = group.groups![groupPath[i]];
    }
    // Uso explícito do tipo StringItem
    const stringItem: StringItem = group.strings[strIndex];
    stringItem.value = value;
    this.localizationFileChanged.emit(fileCopy);
  }

  /**
   * Retorna o contexto para renderização recursiva dos grupos.
   */
  renderGroup(group: Group, groupPath: number[] = []) {
    return {
      group,
      groupPath
    };
  }
}
