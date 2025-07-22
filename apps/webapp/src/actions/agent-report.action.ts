import {
  AgentReportState,
  SortField,
  SortDirection,
} from '../types/agentReportTypes';

export const agentReportActions = {
  setSearchTerm:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (value: string) => {
      setState((prev) => ({ ...prev, searchTerm: value, page: 1 }));
    },

  setSelectedAgent:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (value: string) => {
      setState((prev) => ({ ...prev, selectedAgent: value, page: 1 }));
    },

  setDateFilter:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (value: string) => {
      setState((prev) => ({ ...prev, dateFilter: value, page: 1 }));
    },

  setSorting:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (field: SortField, direction: SortDirection) => {
      setState((prev) => ({
        ...prev,
        sortField: field,
        sortDirection: direction,
      }));
    },

  setPage:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (page: number) => {
      setState((prev) => ({ ...prev, page }));
    },

  resetFilters:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    () => {
      setState({
        searchTerm: '',
        selectedAgent: 'all',
        dateFilter: '',
        sortField: 'date',
        sortDirection: 'desc',
        page: 1,
        rowsPerPage: 10,
      });
    },

  handleSort:
    (setState: React.Dispatch<React.SetStateAction<AgentReportState>>) =>
    (
      field: SortField,
      currentField: SortField,
      currentDirection: SortDirection
    ) => {
      const newDirection =
        field === currentField && currentDirection === 'asc' ? 'desc' : 'asc';
      setState((prev) => ({
        ...prev,
        sortField: field,
        sortDirection: newDirection,
      }));
    },
};

export const exportToCSV = (data: any[]) => {
  const csvContent = [
    ['Date', 'Agent', 'Total Interactions', 'Average Length (seconds)'],
    ...data.map((item) => [
      item.date,
      item.agentName,
      item.totalInteractions.toString(),
      item.averageLength.toString(),
    ]),
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'agents-daily-report.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
