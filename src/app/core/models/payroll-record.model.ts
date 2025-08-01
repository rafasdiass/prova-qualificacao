export interface PayrollRecord {
  nome: string;
  matricula: string;
  cpf: string;
  sexo: 'M' | 'F';
  cargo: string;
  cargo_nivel: string;
  dataadmissao: string;
  datarescisao?: string;
  datanascimento: string;
  ge: string;
  empresa: string;
  estabelecimento: string;
  lotacao: string;
  departamento: string;
  tipo_rubrica: 'BASE' | 'RENDIMENTO' | 'DESCONTO';
  ordem_rubrica: number;
  codigo_rubrica: string;
  valor: number;
  quantidade: number;
  tipo_calculo: 'FO' | 'FE' | 'F13';
  ano_calculo: number;
  mes_calculo: number;
}
