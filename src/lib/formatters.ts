/**
 * Formata um CPF ou CNPJ automaticamente
 * Ex:
 * 12345678900 → 123.456.789-00
 * 12345678000199 → 12.345.678/0001-99
 */
export function formatDocument(doc: string): string {
    if (!doc) return "";
  
    const clean = doc.replace(/\D/g, "");
  
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (clean.length === 14) {
      return clean.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
  
    return doc; // Retorna original se não bater com CPF/CNPJ
  }
  
  /**
   * Formata uma data ISO ou Date para DD/MM/AAAA
   */
  export function formatDate(isoDate: string | Date): string {
    if (!isoDate) return "";
  
    const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  
    if (isNaN(date.getTime())) return ""; // Verifica se é uma data válida
  
    return date.toLocaleDateString("pt-BR");
  }
  
  /**
   * Formata um número como moeda brasileira (BRL)
   * Ex: 1234.56 → R$ 1.234,56
   */
  export function formatCurrency(value: number | string): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
  
    if (isNaN(num)) return "R$ 0,00";
  
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  
  /**
   * Capitaliza a primeira letra de cada palavra
   * Ex: "maria da silva" → "Maria Da Silva"
   */
  export function capitalize(text: string): string {
    if (!text) return "";
    return text.replace(/\b\w/g, (l) => l.toUpperCase());
  }
  
  /**
   * Traduz e estiliza status para exibição (usado para badges/labels)
   */
  export function formatStatus(status: string): string {
    switch (status?.toLowerCase()) {
      case "active":
      case "ativo":
        return "✅ Ativo";
      case "inactive":
      case "inativo":
        return "❌ Inativo";
      case "pending":
      case "pendente":
        return "⏳ Pendente";
      default:
        return status || "Desconhecido";
    }
  }
  