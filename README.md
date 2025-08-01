
# Nasajon Dev Challenge - Prova de Qualificação

Bem-vindo ao projeto de qualificação para Desenvolvedor Pleno/Sênior da Nasajon Sistemas!

Este repositório apresenta a solução dos dois desafios propostos:
- **Tradutor de XML de Localização**
- **Analisador de Folha de Pagamento**

O projeto foi desenvolvido com **Angular 17+ Standalone**, seguindo as melhores práticas de Clean Code, SRP, SOLID, e uma arquitetura modular e profissional.

---

## 🛠️ **Tecnologias Utilizadas**

- [Angular 17+ Standalone](https://angular.io/)
- RxJS
- TypeScript
- HTML/CSS/SCSS
- Bootstrap Icons (opcional, para ícones no UX)

---

## 🚀 **Como rodar o projeto localmente**

### 1. **Clone o repositório**

```bash
git clone https://github.com/rafasdiass/prova-qualificacao.git
cd prova-qualificacao
````

### 2. **Instale as dependências**

```bash
npm install
```

### 3. **Rode o projeto**

```bash
npm start
```

ou

```bash
ng serve
```

O app estará disponível em [http://localhost:4200](http://localhost:4200)

---

## 🎯 **Funcionalidades**

### **1. Tradutor de XML de Localização**

* **Upload** de arquivo XML conforme schema da Nasajon
* **Exibição e edição inline** de todas as strings traduzíveis (interface de tabela dinâmica)
* **Exportação** do XML traduzido com todas as alterações realizadas
* **Feedback visual** para sucesso e erros de importação/exportação

### **2. Analisador de Folha de Pagamento**

* **Upload** de arquivo CSV ou JSON da folha de pagamento
* **Análise automática** dos seguintes cenários:

  * **RENDIMENTO não pago há mais de 6 meses**
  * **DESCONTO com variação brusca (>=5%) em relação a meses anteriores**
* **Exibição dos alertas** encontrados, detalhando o colaborador, rubrica e justificativa
* **Feedback visual** para sucesso, ausência de alertas ou erros

---

## 🏛️ **Arquitetura do Projeto**

O projeto segue o padrão modular Angular por feature, e adota:

* Componentização máxima (cada tela/feature tem seus próprios componentes independentes)
* Serviços para lógica de negócio/validação/análise (SRP e SOLID)
* Modelos TypeScript tipados para todos os dados de domínio
* Navegação via Angular Router e menu principal

### **Estrutura de Pastas Resumida**

```
src/app/
  core/
    models/
    services/
  features/
    xml-translator/
      components/
        xml-upload/
        translation-table/
        export-xml/
      xml-translator-page/
    payroll-analyzer/
      components/
        dataset-upload/
        payroll-alerts/
      payroll-analyzer-page/
  app.component.*
  app.routes.ts
```

---

## 💡 **Como usar**

1. **Acesse o menu no topo da aplicação** e escolha a feature desejada:

  * **Tradutor XML** (`/xml-translator`)
  * **Analisador de Folha** (`/payroll-analyzer`)

2. **Tradutor XML:**

  * Faça o upload do XML de localização.
  * As strings serão exibidas em uma tabela editável.
  * Faça as traduções desejadas diretamente na interface.
  * Exporte o novo XML traduzido usando o botão "Exportar".

3. **Analisador de Folha:**

  * Faça upload do CSV ou JSON da folha.
  * Os alertas são gerados automaticamente e exibidos em lista.
  * Se não houver alertas, uma mensagem de sucesso será exibida.

---

## ✅ **Justificativa Técnica**

* **Angular 17+ standalone** para máxima performance, modernidade e modularização.
* **SRP, SOLID e Clean Code** em todos os arquivos.
* **RxJS** para reatividade de upload/processamento.
* **Tipagem forte** (models e interfaces) para segurança e clareza.
* **Arquitetura escalável:** fácil de expandir, testar e manter.
* **Feedback UX amigável:** mensagens claras para o usuário a cada passo.

---

## ✨ **Exemplo de Fluxo de Uso**

| Página              | O que fazer?                   | Resultado exibido                                |
| ------------------- | ------------------------------ | ------------------------------------------------ |
| Tradutor XML        | Upload XML → Editar → Exportar | Tabela de traduções + Download do XML traduzido  |
| Analisador de Folha | Upload CSV/JSON                | Lista de alertas gerados pela análise automática |

---

## 👤 **Autor**

* Rafael Dias – [LinkedIn](https://www.linkedin.com/in/rdrafaeldias/)
* Projeto para qualificação Dev Nasajon

---

## 📄 **Licença**

Este projeto é apenas para fins de avaliação técnica e não possui licença de uso comercial.

---
