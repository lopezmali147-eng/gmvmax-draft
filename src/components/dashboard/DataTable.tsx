import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  /** 可排序列的取值提取（默认按 render 文本或 row[key]）。 */
  sortValue?: (row: T) => string | number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  dense?: boolean;
  /** 行点击回调（如展开下钻）。 */
  onRowClick?: (row: T) => void;
  rowKey?: (row: T, index: number) => string;
  stickyHeader?: boolean;
}

/**
 * 复用型紧凑表格：size="small"，支持可排序列与行点击。
 * dense 时进一步收紧单元格内边距。
 */
export default function DataTable<T>({
  columns,
  rows,
  dense = true,
  onRowClick,
  rowKey,
  stickyHeader = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortable) return rows;
    const getVal = col.sortValue ?? ((row: T) => (row as Record<string, unknown>)[sortKey] as string | number);
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const cellPadding = dense ? '6px 12px' : '12px 16px';

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table size="small" stickyHeader={stickyHeader} aria-label="data-table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align ?? 'left'}
                sx={{ fontWeight: 700, whiteSpace: 'nowrap', py: 1, bgcolor: 'background.paper' }}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortKey === col.key}
                    direction={sortKey === col.key ? sortDir : 'asc'}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                —
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row, idx) => (
              <TableRow
                key={rowKey ? rowKey(row, idx) : idx}
                hover={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align ?? 'left'}
                    sx={{ py: 0, px: cellPadding, whiteSpace: 'nowrap' }}
                  >
                    <Box sx={{ py: dense ? 0.5 : 1 }}>{col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}</Box>
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
