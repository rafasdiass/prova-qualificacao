import { Injectable } from '@angular/core';
import { PayrollRecord } from '../models/payroll-record.model';
import { PayrollAlert } from '../models/payroll-alert.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PayrollAnalyzerService {
  /**
   * Parse CSV ou JSON em array tipada.
   * Pode ser expandido com uma Factory se precisar suportar outros formatos.
   */
  parseDataset(input: string | File): Observable<PayrollRecord[]> {
    // Apenas exemplo, deve adaptar para uso real
    return new Observable<PayrollRecord[]>((subscriber) => {
      if (typeof input === 'string') {
        try {
          // Detecta JSON
          if (input.trim().startsWith('[')) {
            const arr = JSON.parse(input) as PayrollRecord[];
            subscriber.next(arr);
            subscriber.complete();
            return;
          }
          // Detecta CSV simples (assume que a primeira linha é header)
          const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
          const [header, ...rows] = lines;
          const keys = header.split(',');
          const data = rows.map((row) => {
            const values = row.split(',');
            const obj: any = {};
            keys.forEach((k, i) => (obj[k.trim()] = values[i]?.trim()));
            // Conversão básica de tipos pode ser feita aqui
            return obj as PayrollRecord;
          });
          subscriber.next(data);
          subscriber.complete();
        } catch (err) {
          subscriber.error('Erro ao parsear dataset: ' + (err as Error).message);
        }
      } else {
        // File API
        const reader = new FileReader();
        reader.onload = (e) => {
          this.parseDataset(e.target?.result as string).subscribe({
            next: (result) => {
              subscriber.next(result);
              subscriber.complete();
            },
            error: (err) => subscriber.error(err),
          });
        };
        reader.onerror = (err) => subscriber.error(err);
        reader.readAsText(input);
      }
    });
  }

  /**
   * Regra: RENDIMENTO não pago há mais de 6 meses para esse colaborador.
   */
  findMissingRendimentos(records: PayrollRecord[]): PayrollAlert[] {
    const alerts: PayrollAlert[] = [];
    // Agrupa por colaborador + rubrica
    const byColabRubrica = new Map<string, PayrollRecord[]>();
    records.forEach((rec) => {
      if (rec.tipo_rubrica === 'RENDIMENTO') {
        const key = `${rec.matricula}_${rec.codigo_rubrica}`;
        if (!byColabRubrica.has(key)) byColabRubrica.set(key, []);
        byColabRubrica.get(key)!.push(rec);
      }
    });

    byColabRubrica.forEach((items, key) => {
      // Ordena por ano/mes
      items.sort((a, b) =>
        a.ano_calculo !== b.ano_calculo
          ? a.ano_calculo - b.ano_calculo
          : a.mes_calculo - b.mes_calculo
      );
      // Verifica lacunas de 6 meses ou mais
      for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1];
        const curr = items[i];
        const monthsDiff = (curr.ano_calculo - prev.ano_calculo) * 12 + (curr.mes_calculo - prev.mes_calculo);
        if (monthsDiff >= 6) {
          alerts.push({
            type: 'RENDIMENTO_ATIPICO',
            message: `Rubrica de RENDIMENTO (${curr.codigo_rubrica}) não paga por ${monthsDiff} meses para ${curr.nome}.`,
            record: curr,
          });
        }
      }
    });

    return alerts;
  }

  /**
   * Regra: DESCONTO que varia mais de 5% em relação à média dos meses anteriores.
   */
  findAbruptDescontoChanges(records: PayrollRecord[]): PayrollAlert[] {
    const alerts: PayrollAlert[] = [];
    // Agrupa por colaborador + rubrica
    const byColabRubrica = new Map<string, PayrollRecord[]>();
    records.forEach((rec) => {
      if (rec.tipo_rubrica === 'DESCONTO') {
        const key = `${rec.matricula}_${rec.codigo_rubrica}`;
        if (!byColabRubrica.has(key)) byColabRubrica.set(key, []);
        byColabRubrica.get(key)!.push(rec);
      }
    });

    byColabRubrica.forEach((items, key) => {
      // Ordena por ano/mes
      items.sort((a, b) =>
        a.ano_calculo !== b.ano_calculo
          ? a.ano_calculo - b.ano_calculo
          : a.mes_calculo - b.mes_calculo
      );
      // Analisa a variação
      for (let i = 1; i < items.length; i++) {
        const prev = items[i - 1];
        const curr = items[i];
        const diff = curr.valor - prev.valor;
        const perc = (diff / (prev.valor || 1)) * 100;
        if (Math.abs(perc) >= 5) {
          alerts.push({
            type: 'DESCONTO_VARIACAO',
            message: `Rubrica de DESCONTO (${curr.codigo_rubrica}) teve variação de ${perc.toFixed(2)}% em ${curr.mes_calculo}/${curr.ano_calculo} para ${curr.nome}.`,
            record: curr,
          });
        }
      }
    });

    return alerts;
  }

  /**
   * Retorna todos os alertas encontrados aplicando as duas regras.
   */
  analyzePayroll(records: PayrollRecord[]): PayrollAlert[] {
    return [
      ...this.findMissingRendimentos(records),
      ...this.findAbruptDescontoChanges(records)
    ];
  }
}
