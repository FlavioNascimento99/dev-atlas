type ComparisonTableProps = {
  caption: string
  /** First column labels the compared aspect; the remaining columns are the compared options. */
  columns: string[]
  rows: string[][]
}

export function ComparisonTable({ caption, columns, rows }: ComparisonTableProps) {
  return (
    <div role="region" aria-label={caption} tabIndex={0} className="my-6 overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <caption className="border-b bg-subtle px-4 py-2 text-left font-medium">{caption}</caption>
        <thead>
          <tr className="border-b bg-subtle">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-2.5 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([aspect, ...values]) => (
            <tr key={aspect} className="border-b last:border-b-0">
              <th scope="row" className="px-4 py-2.5 font-medium text-muted-foreground">
                {aspect}
              </th>
              {values.map((value, index) => (
                <td key={`${aspect}-${index}`} className="px-4 py-2.5">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
