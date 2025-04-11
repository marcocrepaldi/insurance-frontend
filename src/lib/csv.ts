type CSVExportOptions<T> = {
    headers?: Record<keyof T, string> // cabeçalhos customizados
    transformRow?: (row: T) => Record<string, any> // transformação de dados por linha
  }
  
  export function downloadCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    options?: CSVExportOptions<T>
  ) {
    if (!data.length) return
  
    const { headers, transformRow } = options || {}
  
    const transformed = transformRow ? data.map(transformRow) : data
    const keys = headers ? Object.keys(headers) : Object.keys(transformed[0])
  
    const headerLine = headers
      ? Object.values(headers).join(",")
      : keys.join(",")
  
    const rows = transformed.map((row) =>
      keys
        .map((key) => {
          const value = row[key]
          const escaped = String(value ?? "").replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(",")
    )
  
    const csvContent = [headerLine, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  