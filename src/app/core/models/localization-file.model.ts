export interface LocalizationFile {
  culture: string;
  moduleId: string;
  groups: Group[];
}

export interface Group {
  name: string;
  tags?: string;
  groups?: Group[];
  strings: StringItem[];
}

export interface StringItem {
  key: string;
  value: string;
}
