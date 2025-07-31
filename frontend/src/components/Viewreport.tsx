import React, { useState, useMemo } from 'react';
import { ChevronDown, Eye, EyeOff, Search, CheckSquare, Square } from 'lucide-react';

// Sample data for all examples
interface DataItem {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
}

interface Column {
  key: 'name' | 'email' | 'role' | 'department' | 'salary';
  label: string;
}

interface ColumnVisibility {
  name: boolean;
  email: boolean;
  role: boolean;
  department: boolean;
  salary: boolean;
}

const sampleData: DataItem[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'Engineering', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Design', salary: 70000 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', department: 'Engineering', salary: 90000 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer', department: 'Engineering', salary: 80000 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Analyst', department: 'Marketing', salary: 65000 },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'Designer', department: 'Design', salary: 72000 },
];

// TanStack Table Example (Simulated - since we can't import the actual library)
const TanStackTableExample = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    role: true,
    department: true,
    salary: true
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'salary', label: 'Salary' }
  ];

  const filteredData = useMemo(() => {
    return sampleData.filter(row => 
      Object.values(row).some(value => 
        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [globalFilter]);

  const toggleRowSelection = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)));
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">TanStack Table Example</h3>
        
        {/* Column Visibility Controls */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">Show Columns:</label>
          <div className="flex flex-wrap gap-2">
            {columns.map(col => (
              <button
                key={col.key}
                onClick={() => setColumnVisibility(prev => ({...prev, [col.key]: !prev[col.key]}))}
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  columnVisibility[col.key] 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-500 border border-gray-300'
                }`}
              >
                {columnVisibility[col.key] ? <Eye size={14} /> : <EyeOff size={14} />}
                {col.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Filter */}
        <div className="flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Filter by name..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">
            {selectedRows.size} of {filteredData.length} selected
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <button onClick={toggleAllRows} className="flex items-center">
                  {selectedRows.size === filteredData.length && filteredData.length > 0 ? 
                    <CheckSquare size={16} className="text-blue-600" /> : 
                    <Square size={16} className="text-gray-400" />
                  }
                </button>
              </th>
              {columns.map(col => (
                columnVisibility[col.key] && (
                  <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-700">
                    {col.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map(row => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                <td className="px-4 py-3">
                  <button onClick={() => toggleRowSelection(row.id)}>
                    {selectedRows.has(row.id) ? 
                      <CheckSquare size={16} className="text-blue-600" /> : 
                      <Square size={16} className="text-gray-400" />
                    }
                  </button>
                </td>
                {columnVisibility.name && <td className="px-4 py-3">{row.name}</td>}
                {columnVisibility.email && <td className="px-4 py-3 text-gray-600">{row.email}</td>}
                {columnVisibility.role && <td className="px-4 py-3">{row.role}</td>}
                {columnVisibility.department && <td className="px-4 py-3">{row.department}</td>}
                {columnVisibility.salary && <td className="px-4 py-3">${row.salary.toLocaleString()}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Material React Table Example (Simulated)
const MaterialReactTableExample = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    role: true,
    department: true,
    salary: true
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const filteredData = useMemo(() => {
    return sampleData.filter(row => 
      Object.values(row).some(value => 
        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [globalFilter]);

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'salary', label: 'Salary' }
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-purple-50">
        <h3 className="text-lg font-semibold mb-3 text-purple-800">Material React Table Example</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
            >
              <Eye size={16} />
              Columns
              <ChevronDown size={14} />
            </button>
            
            {showColumnMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={columnVisibility[col.key]}
                        onChange={(e) => setColumnVisibility(prev => ({...prev, [col.key]: e.target.checked}))}
                        className="rounded text-purple-600"
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-purple-600">
          {selectedRows.size} of {filteredData.length} rows selected
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onChange={() => {
                    if (selectedRows.size === filteredData.length) {
                      setSelectedRows(new Set());
                    } else {
                      setSelectedRows(new Set(filteredData.map(row => row.id)));
                    }
                  }}
                  className="rounded text-purple-600"
                />
              </th>
              {columns.map(col => (
                columnVisibility[col.key] && (
                  <th key={col.key} className="px-4 py-3 text-left font-medium text-purple-800">
                    {col.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map(row => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => {
                      const newSelection = new Set(selectedRows);
                      if (newSelection.has(row.id)) {
                        newSelection.delete(row.id);
                      } else {
                        newSelection.add(row.id);
                      }
                      setSelectedRows(newSelection);
                    }}
                    className="rounded text-purple-600"
                  />
                </td>
                {columnVisibility.name && <td className="px-4 py-3 font-medium">{row.name}</td>}
                {columnVisibility.email && <td className="px-4 py-3 text-gray-600">{row.email}</td>}
                {columnVisibility.role && <td className="px-4 py-3">{row.role}</td>}
                {columnVisibility.department && <td className="px-4 py-3">{row.department}</td>}
                {columnVisibility.salary && <td className="px-4 py-3">${row.salary.toLocaleString()}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mantine React Table Example (Simulated)
const MantineReactTableExample = () => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    role: true,
    department: true,
    salary: true
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const filteredData = useMemo(() => {
    return sampleData.filter(row => 
      Object.values(row).some(value => 
        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [globalFilter]);

  const columns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'salary', label: 'Salary' }
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-teal-50">
        <h3 className="text-lg font-semibold mb-3 text-teal-800">Mantine React Table Example</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Global search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-teal-700">Visible Columns:</span>
            <div className="flex flex-wrap gap-1">
              {columns.map(col => (
                <button
                  key={col.key}
                  onClick={() => setColumnVisibility(prev => ({...prev, [col.key]: !prev[col.key]}))}
                  className={`px-2 py-1 text-xs rounded ${
                    columnVisibility[col.key] 
                      ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                      : 'bg-gray-100 text-gray-500 border border-gray-300'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-teal-600">
            Showing {filteredData.length} rows
          </div>
          <div className="text-sm text-teal-600">
            {selectedRows.size} selected
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-teal-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                  onChange={() => {
                    if (selectedRows.size === filteredData.length) {
                      setSelectedRows(new Set());
                    } else {
                      setSelectedRows(new Set(filteredData.map(row => row.id)));
                    }
                  }}
                  className="rounded text-teal-600"
                />
              </th>
              {columns.map(col => (
                columnVisibility[col.key] && (
                  <th key={col.key} className="px-4 py-3 text-left font-medium text-teal-800 border-r border-teal-200 last:border-r-0">
                    {col.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map(row => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'bg-teal-50' : 'hover:bg-gray-50'}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => {
                      const newSelection = new Set(selectedRows);
                      if (newSelection.has(row.id)) {
                        newSelection.delete(row.id);
                      } else {
                        newSelection.add(row.id);
                      }
                      setSelectedRows(newSelection);
                    }}
                    className="rounded text-teal-600"
                  />
                </td>
                {columnVisibility.name && <td className="px-4 py-3 font-medium border-r border-gray-200">{row.name}</td>}
                {columnVisibility.email && <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{row.email}</td>}
                {columnVisibility.role && <td className="px-4 py-3 border-r border-gray-200">{row.role}</td>}
                {columnVisibility.department && <td className="px-4 py-3 border-r border-gray-200">{row.department}</td>}
                {columnVisibility.salary && <td className="px-4 py-3">${row.salary.toLocaleString()}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const TableLibrariesComparison = () => {
  const [activeTab, setActiveTab] = useState('tanstack');

  const tabs = [
    { id: 'tanstack', label: 'TanStack Table', color: 'blue' },
    { id: 'material', label: 'Material React Table', color: 'purple' },
    { id: 'mantine', label: 'Mantine React Table', color: 'teal' }
  ];

  const getTabClassName = (tabId: string, tabColor: string) => {
    const isActive = activeTab === tabId;
    const colorClasses = {
      blue: isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700',
      purple: isActive ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700',
      teal: isActive ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    };
    
    return `px-4 py-2 font-medium border-b-2 transition-colors ${colorClasses[tabColor as keyof typeof colorClasses]}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">React Table Libraries Comparison</h1>
        <p className="text-gray-600">
          Try all three examples below. Each shows column visibility, row selection, and name filtering.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={getTabClassName(tab.id, tab.color)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'tanstack' && <TanStackTableExample />}
        {activeTab === 'material' && <MaterialReactTableExample />}
        {activeTab === 'mantine' && <MantineReactTableExample />}
      </div>

      {/* Installation Commands */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Installation Commands:</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>TanStack Table:</strong>
            <code className="ml-2 px-2 py-1 bg-gray-200 rounded">npm install @tanstack/react-table</code>
          </div>
          <div>
            <strong>Material React Table:</strong>
            <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">
              npm install material-react-table @mui/material @emotion/react @emotion/styled @mui/icons-material
            </code>
          </div>
          <div>
            <strong>Mantine React Table:</strong>
            <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">
              npm install mantine-react-table @mantine/core @mantine/hooks @mantine/dates dayjs @tabler/icons-react
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLibrariesComparison;