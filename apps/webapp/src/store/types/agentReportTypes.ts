export type SortField =
  | 'date'
  | 'agentName'
  | 'totalInteractions'
  | 'averageLength';
export type SortDirection = 'asc' | 'desc';

export interface AgentReportState {
  searchTerm: string;
  selectedAgent: string;
  dateFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  rowsPerPage: number;
}

export interface AgentDailyData {
  date: string;
  agentId: number;
  agentName: string;
  totalInteractions: number;
  averageLength: number;
}
