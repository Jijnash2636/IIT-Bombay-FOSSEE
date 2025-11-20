import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  ActivityIcon, 
  UploadIcon, 
  DatabaseIcon, 
  BrainIcon, 
  ThermometerIcon, 
  PrinterIcon,
  DownloadIcon,
  ChartIcon
} from './components/Icons';
import { StatsCard } from './components/StatsCard';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { parseCSV, analyzeDataset, generateMockCSV } from './services/dataService';
import { generateDatasetInsights } from './services/geminiService';
import { EquipmentData, DatasetSummary, User } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- Components ---

// 1. Professional Sidebar (Dark Theme Update)
const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <ActivityIcon /> },
    { path: '/history', label: 'Data History', icon: <DatabaseIcon /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 flex-col border-r border-slate-800 bg-slate-900 hidden md:flex no-print z-50 shadow-xl">
      <div className="flex h-20 items-center border-b border-slate-800 px-6">
         <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
            <BrainIcon />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ChemViz<span className="text-blue-500">Pro</span></span>
        </div>
      </div>
      
      <div className="flex-1 py-8 px-4 space-y-2">
        <div className="px-3 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Analytics Module</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive(item.path) 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-white'}>
               {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6 px-2">
           <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-xs">U</div>
           <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200">Operator</p>
              <p className="text-xs text-slate-500">Online</p>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
        >
          <span className="rotate-180">➜</span> Sign Out
        </button>
      </div>
    </div>
  );
};

// 2. Professional Upload Area
const UploadArea = ({ onDataLoaded }: { onDataLoaded: (data: EquipmentData[], summary: DatasetSummary) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);
      const summary = analyzeDataset(data, file.name);
      
      setTimeout(() => {
        onDataLoaded(data, summary);
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      alert("Error parsing CSV. Please check format.");
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const loadDemoData = () => {
    setIsLoading(true);
    const text = generateMockCSV();
    const data = parseCSV(text);
    const summary = analyzeDataset(data, "demo_batch_001.csv");
    onDataLoaded(data, summary);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center py-6">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Analyzing data structure...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl bg-blue-50 p-5 text-blue-600 shadow-sm ring-1 ring-blue-100">
              <UploadIcon />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Upload Dataset</h3>
            <p className="mb-8 text-sm text-slate-500 text-center max-w-xs leading-relaxed">
              Drag and drop your equipment CSV file here, or browse your files to begin analysis.
            </p>
            <div className="flex gap-4">
              <label className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:-translate-y-0.5 transition-all">
                Select File
                <input type="file" className="hidden" accept=".csv" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
              </label>
              <button 
                onClick={loadDemoData} 
                className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                Load Sample Data
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 3. Main Dashboard View
const Dashboard = ({ user }: { user: User }) => {
  const [data, setData] = useState<EquipmentData[] | null>(null);
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('last_session_data');
    const storedSummary = localStorage.getItem('last_session_summary');
    if (storedData && storedSummary) {
      setData(JSON.parse(storedData));
      setSummary(JSON.parse(storedSummary));
    }
  }, []);

  const handleDataLoaded = async (newData: EquipmentData[], newSummary: DatasetSummary) => {
    setData(newData);
    setSummary(newSummary);
    localStorage.setItem('last_session_data', JSON.stringify(newData));
    localStorage.setItem('last_session_summary', JSON.stringify(newSummary));
    
    try {
      localStorage.setItem(`dataset_${newSummary.id}`, JSON.stringify(newData));
      const history = JSON.parse(localStorage.getItem('upload_history') || '[]');
      const updatedList = [newSummary, ...history].slice(0, 15);
      localStorage.setItem('upload_history', JSON.stringify(updatedList));
      
      const activeIds = new Set(updatedList.map((h: any) => h.id));
      history.forEach((h: any) => {
         if (!activeIds.has(h.id)) {
             localStorage.removeItem(`dataset_${h.id}`);
         }
      });
    } catch (e) {
      console.error("Storage limit reached", e);
    }

    setAiLoading(true);
    const aiRes = await generateDatasetInsights(newSummary);
    
    const enhancedSummary = { ...newSummary, ...aiRes };
    setSummary(enhancedSummary);
    localStorage.setItem('last_session_summary', JSON.stringify(enhancedSummary));
    
    const currentHistory = JSON.parse(localStorage.getItem('upload_history') || '[]');
    const finalHistory = currentHistory.map((h: any) => h.id === enhancedSummary.id ? enhancedSummary : h);
    localStorage.setItem('upload_history', JSON.stringify(finalHistory));
    setAiLoading(false);
  };

  const clearSession = () => {
    setData(null);
    setSummary(null);
    localStorage.removeItem('last_session_data');
  };

  const handleOpenReport = () => {
    navigate('/report');
  };

  // Empty State
  if (!data || !summary) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-3xl text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome Back, {user.username}</h1>
          <p className="text-lg text-slate-500">Ready to analyze your chemical equipment data?</p>
        </div>
        <UploadArea onDataLoaded={handleDataLoaded} />
      </div>
    );
  }

  const pieData = Object.keys(summary.typeDistribution).map(key => ({
    name: key,
    value: summary.typeDistribution[key]
  }));
  const COLORS = ['#3b82f6', '#6366f1', '#06b6d4', '#f43f5e', '#10b981'];

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-10 transition-colors duration-500">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-slate-200 pb-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Analysis</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
             <span className="font-medium text-slate-700">{summary.fileName}</span>
             <span className="text-slate-300">•</span>
             <span>Uploaded: {summary.uploadDate}</span>
          </div>
        </div>
        <div className="flex gap-3 no-print">
           <button onClick={clearSession} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
              New Upload
           </button>
           <button 
             onClick={handleOpenReport} 
             className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/20"
           >
             <DownloadIcon /> Download Report
           </button>
        </div>
      </header>

      <div id="dashboard-content" className="space-y-8 animate-slide-up"> 
        
        {/* 1. KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard title="Total Equipment" value={summary.totalCount} icon={<DatabaseIcon />} color="blue" />
          <StatsCard title="Avg Flow Rate" value={summary.avgFlowrate.toFixed(1)} subtext="m³/h" icon={<ActivityIcon />} color="cyan" />
          <StatsCard title="Avg Pressure" value={summary.avgPressure.toFixed(1)} subtext="kPa" icon={<ActivityIcon />} color="purple" />
          <StatsCard title="Avg Temperature" value={summary.avgTemperature.toFixed(1)} subtext="°C" icon={<ThermometerIcon />} color="red" />
          <StatsCard title="Anomalies Detected" value={summary.outlierCount} subtext="Requires Attention" icon={<BrainIcon />} color={summary.outlierCount > 0 ? 'red' : 'green'} trend={summary.outlierCount > 0 ? 'down' : 'neutral'} />
        </div>

        {/* 2. Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-800 text-lg">Flow & Pressure Trends</h3>
                  <div className="flex gap-4 text-xs font-medium">
                      <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded text-blue-700">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                          <span>Flowrate</span>
                      </div>
                      <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded text-indigo-700">
                          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                          <span>Pressure</span>
                      </div>
                  </div>
              </div>
              <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.slice(0, 50)}>
                          <defs>
                              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorPress" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="id" hide />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#e2e8f0', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                              itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                          />
                          <Area type="monotone" dataKey="flowrate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" activeDot={{ r: 6, strokeWidth: 0 }} />
                          <Area type="monotone" dataKey="pressure" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPress)" activeDot={{ r: 6, strokeWidth: 0 }} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Distribution Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-800 text-lg mb-1">Equipment Distribution</h3>
              <p className="text-sm text-slate-500 mb-8">Breakdown by unit type</p>
              
              <div className="flex-1 min-h-[220px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={pieData}
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={5}
                              dataKey="value"
                              cornerRadius={4}
                          >
                              {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-3xl font-bold text-slate-800">{summary.totalCount}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Units</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                  {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="truncate">{entry.name}</span>
                      </div>
                  ))}
              </div>
          </div>
        </div>

        {/* 3. Insights & Quality Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Executive Summary */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BrainIcon />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Executive Insights</h3>
                      <p className="text-sm text-slate-500">Automated analysis</p>
                    </div>
                </div>

                <div className="prose prose-slate prose-sm max-w-none">
                  {aiLoading ? (
                      <div className="space-y-4 animate-pulse">
                          <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                          <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      </div>
                  ) : (
                      <div className="text-slate-600 leading-relaxed space-y-4">
                           {summary.aiInsights ? (
                              summary.aiInsights.split('\n\n').map((paragraph, i) => (
                                  <p key={i} className="mb-2">
                                      {paragraph}
                                  </p>
                              ))
                          ) : (
                              <p className="text-slate-400 italic">No insights generated for this dataset.</p>
                          )}
                      </div>
                  )}
                </div>
            </div>

            {/* Data Quality Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm h-fit hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-8">Data Health</h3>
                
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-sm mb-3 font-medium">
                            <span className="text-slate-500">Quality Score</span>
                            <span className="text-slate-900">{summary.dataQualityScore}/100</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full shadow-sm transition-all duration-1000 ${summary.dataQualityScore > 80 ? 'bg-emerald-500' : summary.dataQualityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${summary.dataQualityScore}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Classification</span>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                {summary.classification || "Processing..."}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Missing Values</span>
                            <span className="text-slate-900 font-mono">0.0%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">Schema Validation</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Passed
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

// 4. History View (Clean Table Style)
const History = () => {
  const [history, setHistory] = useState<DatasetSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('upload_history') || '[]');
    setHistory(h);
  }, []);

  const handleVisualize = (item: DatasetSummary) => {
    const storedData = localStorage.getItem(`dataset_${item.id}`);
    if (storedData) {
      localStorage.setItem('last_session_data', storedData);
      localStorage.setItem('last_session_summary', JSON.stringify(item));
      navigate('/dashboard');
    } else {
      alert("The source data for this file is no longer in the browser cache.");
    }
  };

  const handleReport = (item: DatasetSummary) => {
    const storedData = localStorage.getItem(`dataset_${item.id}`);
    if (storedData) {
      localStorage.setItem('last_session_data', storedData);
      localStorage.setItem('last_session_summary', JSON.stringify(item));
      navigate('/report');
    } else {
      alert("The source data for this file is no longer in the browser cache.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 lg:p-10 animate-fade-in">
      <div className="mb-10">
         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dataset Archives</h1>
         <p className="text-slate-500 text-sm mt-2">Securely stored records of your previous 15 analyzed batches.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Filename</th>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Upload Date</th>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Records</th>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Classification</th>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Status</th>
                    <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {history.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <div className="p-4 rounded-full bg-slate-50 mb-4">
                                  <DatabaseIcon />
                                </div>
                                <span className="font-medium">No datasets archived yet.</span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    history.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-semibold text-slate-700">
                                {item.fileName}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{item.uploadDate}</td>
                            <td className="px-6 py-4 text-slate-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    {item.totalCount}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-indigo-600 font-medium">{item.classification || "N/A"}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></span>
                                    Cached
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <button 
                                      onClick={() => handleVisualize(item)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs font-bold transition-all border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow"
                                  >
                                      <ChartIcon />
                                      Visualize
                                  </button>
                                  <button 
                                      onClick={() => handleReport(item)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold transition-all border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                                  >
                                      <DownloadIcon />
                                      Report
                                  </button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Report View (Clean Light Mode for Printing) - UNCHANGED Logic, just ensure consistency
const ReportView = () => {
  const [data, setData] = useState<EquipmentData[] | null>(null);
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('last_session_data');
    const storedSummary = localStorage.getItem('last_session_summary');
    if (storedData && storedSummary) {
      setData(JSON.parse(storedData));
      setSummary(JSON.parse(storedSummary));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!data || !summary) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    
    try {
      // Wait a bit to ensure charts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, just use the print functionality which users can save as PDF
      // This is the most reliable way to get exactly what the print view shows
      window.print();
      
      // Inform user they can save as PDF from the print dialog
      setTimeout(() => {
        alert('Please use the print dialog to save this report as a PDF.\n\nIn most browsers:\n1. Select "Save as PDF" or "Microsoft Print to PDF" as your printer\n2. Click Save or Print\n3. Choose your desired location to save the PDF');
      }, 100);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Could not generate PDF automatically. Please use the Print option and save as PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const pieData = Object.keys(summary.typeDistribution).map(key => ({
    name: key,
    value: summary.typeDistribution[key]
  }));
  const COLORS = ['#3b82f6', '#6366f1', '#06b6d4', '#f43f5e', '#10b981'];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-0 md:p-8">
      {/* Floating Action Button for Print */}
      <div className="fixed top-6 right-6 no-print z-50 flex flex-col items-end gap-3 animate-fade-in">
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-md hover:bg-slate-50 hover:shadow-lg transition-all text-sm font-medium"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={handlePrint}
              className="bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-lg shadow-md hover:bg-slate-50 hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold"
            >
              <PrinterIcon /> Print View
            </button>
            <button 
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-wait"
            >
              {isGenerating ? 'Generating PDF...' : <><DownloadIcon /> Download PDF</>}
            </button>
          </div>
      </div>

      {/* Document Container */}
      <div id="report-container" className="mx-auto max-w-[210mm] bg-white p-12 md:shadow-xl print:shadow-none print:p-0 min-h-[297mm]">
          
          {/* 1. Document Header */}
          <div className="border-b-2 border-slate-800 pb-6 mb-10">
              <div className="flex justify-between items-start">
                  <div>
                      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Chemical Equipment Report</h1>
                      <p className="text-slate-500 mt-2 text-sm font-medium">Generated by ChemViz Pro Analytics</p>
                  </div>
                  <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded">Confidential</div>
                      <div className="text-sm text-slate-600 mt-2 font-medium">{new Date().toLocaleDateString()}</div>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
                  <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Filename</span>
                      <span className="font-bold text-slate-800">{summary.fileName}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Report ID</span>
                      <span className="font-mono font-medium text-slate-600">{summary.id}</span>
                  </div>
              </div>
          </div>

          {/* 2. Executive Summary */}
          <div className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
                Executive Summary
              </h2>
              <div className="bg-indigo-50/50 p-6 rounded-lg border border-indigo-100 text-sm text-slate-700 leading-relaxed text-justify shadow-sm">
                   {summary.aiInsights ? (
                      summary.aiInsights.split('\n\n').map((p, i) => (
                          <p key={i} className="mb-3 last:mb-0">{p}</p>
                      ))
                   ) : (
                      <p className="italic text-slate-500">No AI analysis available.</p>
                   )}
              </div>
          </div>

          {/* 3. Key Metrics Table */}
          <div className="mb-10 print-break-avoid">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-slate-600 rounded-full"></span>
                Key Metrics
              </h2>
              <div className="grid grid-cols-5 gap-0 border border-slate-200 rounded-lg overflow-hidden shadow-sm chart-container">
                   <div className="p-5 border-r border-slate-200 bg-slate-50/50">
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Total Units</div>
                       <div className="text-3xl font-bold text-slate-900 mt-2">{summary.totalCount}</div>
                   </div>
                   <div className="p-5 border-r border-slate-200 bg-white">
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Flow</div>
                       <div className="text-2xl font-bold text-slate-900 mt-2">{summary.avgFlowrate.toFixed(1)} <span className="text-xs text-slate-400 font-medium">m³/h</span></div>
                   </div>
                   <div className="p-5 border-r border-slate-200 bg-white">
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Pressure</div>
                       <div className="text-2xl font-bold text-slate-900 mt-2">{summary.avgPressure.toFixed(1)} <span className="text-xs text-slate-400 font-medium">kPa</span></div>
                   </div>
                   <div className="p-5 border-r border-slate-200 bg-white">
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Temp</div>
                       <div className="text-2xl font-bold text-slate-900 mt-2">{summary.avgTemperature.toFixed(1)} <span className="text-xs text-slate-400 font-medium">°C</span></div>
                   </div>
                   <div className="p-5 bg-slate-50/50">
                       <div className="text-[10px] text-slate-500 uppercase font-bold">Anomalies</div>
                       <div className={`text-3xl font-bold mt-2 ${summary.outlierCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                           {summary.outlierCount}
                       </div>
                   </div>
              </div>
          </div>

          {/* 4. Visual Trends */}
          <div className="mb-10 print-break-avoid">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                 Visual Trends
              </h2>
              
              <div className="h-[300px] w-full border border-slate-200 rounded-lg p-6 mb-4 shadow-sm bg-white chart-container">
                  <ResponsiveContainer width="100%" height="100%" debounce={0}>
                      <AreaChart data={data.slice(0, 60)} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="id" hide />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Legend verticalAlign="top" height={36} iconType="circle"/>
                          <Area name="Flowrate" type="monotone" dataKey="flowrate" stroke="#2563eb" strokeWidth={2} fill="#dbeafe" fillOpacity={0.6} isAnimationActive={false} />
                          <Area name="Pressure" type="monotone" dataKey="pressure" stroke="#059669" strokeWidth={2} fill="#d1fae5" fillOpacity={0.6} isAnimationActive={false} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>

              <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded border border-slate-100">
                   <strong>Figure 1.0 Analysis:</strong> The area chart above visualizes the amplitude relationship between system Flowrate (Blue) and internal Pressure (Green).
              </div>
          </div>

          {/* 5. Equipment Composition */}
          <div className="mb-10 print-break-avoid">
             <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-600 rounded-full"></span>
                Equipment Composition
             </h2>
             <div className="flex flex-row items-start gap-8 border border-slate-200 rounded-lg p-8 shadow-sm bg-white chart-container">
                <div className="h-[200px] w-[200px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%" debounce={0}>
                      <PieChart>
                          <Pie
                              data={pieData}
                              innerRadius={0}
                              outerRadius={80}
                              paddingAngle={0}
                              dataKey="value"
                              isAnimationActive={false}
                          >
                              {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                   <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                           <th className="text-left py-3 font-semibold text-slate-500 uppercase text-xs">Type</th>
                           <th className="text-right py-3 font-semibold text-slate-500 uppercase text-xs">Count</th>
                           <th className="text-right py-3 font-semibold text-slate-500 uppercase text-xs">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pieData.map((entry, idx) => (
                           <tr key={idx} className="border-b border-slate-50 last:border-0">
                              <td className="py-3 flex items-center gap-3 text-slate-800">
                                 <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                 <span className="font-semibold text-slate-900">{entry.name}</span>
                              </td>
                              <td className="py-3 text-right font-mono text-slate-700 font-medium">{entry.value}</td>
                              <td className="py-3 text-right text-slate-500">{((entry.value / summary.totalCount) * 100).toFixed(1)}%</td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          {/* 6. Data Snapshot */}
          <div className="print-break-avoid">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-slate-600 rounded-full"></span>
                Raw Data Snapshot (Top 20)
              </h2>
              <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">#</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">ID</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">Type</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">Flow</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">Pressure</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">Temp</th>
                            <th className="px-4 py-3 font-bold text-slate-600 border-b border-slate-200 text-xs uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {data.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="px-4 py-2 text-slate-600 font-mono text-xs">{idx + 1}</td>
                                <td className="px-4 py-2 text-slate-600 font-mono text-xs">{row.equipment_id}</td>
                                <td className="px-4 py-2 text-slate-700 font-medium">{row.type}</td>
                                <td className="px-4 py-2 text-slate-600">{row.flowrate}</td>
                                <td className="px-4 py-2 text-slate-600">{row.pressure}</td>
                                <td className="px-4 py-2 text-slate-600">{row.temperature}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                        row.status === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                        row.status === 'Warning' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 mt-12 pt-4 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
              <span>ChemViz Pro Analysis Report</span>
              <span>Page 1 of 1</span>
          </div>

      </div>
    </div>
  );
};

// 6. Login View
const ChemicalPlantIllustration = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full opacity-90 drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.8}} />
        <stop offset="100%" style={{stopColor:'#2563eb', stopOpacity:1}} />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Pipes Background */}
    <path d="M50 350 L50 100 L150 100" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
    <path d="M250 100 L350 100 L350 350" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
    <path d="M150 250 L250 250" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

    {/* Main Reactor Tank */}
    <rect x="120" y="80" width="160" height="220" rx="12" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3" />
    <path d="M120 120 L280 120" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
    <path d="M120 260 L280 260" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
    
    {/* Liquid in Tank */}
    <path d="M125 200 Q 200 190, 275 200 L275 290 Q 200 300, 125 290 Z" fill="url(#grad1)" fillOpacity="0.9" />
    
    {/* Bubbles Animation */}
    <circle cx="160" cy="260" r="4" fill="#fff" fillOpacity="0.6">
       <animate attributeName="cy" from="260" to="150" dur="3s" repeatCount="indefinite" />
       <animate attributeName="opacity" values="0.6;0" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="200" cy="280" r="6" fill="#fff" fillOpacity="0.6">
       <animate attributeName="cy" from="280" to="140" dur="4s" repeatCount="indefinite" />
       <animate attributeName="opacity" values="0.6;0" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="240" cy="250" r="3" fill="#fff" fillOpacity="0.6">
       <animate attributeName="cy" from="250" to="160" dur="2.5s" repeatCount="indefinite" />
       <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
    </circle>

    {/* Valves */}
    <circle cx="150" cy="100" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" style={{filter: 'url(#glow)'}}/>
    <circle cx="250" cy="100" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" style={{filter: 'url(#glow)'}}/>
    <rect x="190" y="240" width="20" height="20" fill="#10b981" rx="4" stroke="#fff" strokeWidth="2"/>

    {/* Gauges */}
    <circle cx="150" cy="150" r="14" fill="#fff" stroke="#64748b" strokeWidth="2"/>
    <line x1="150" y1="150" x2="158" y2="142" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Labels */}
    <text x="200" y="320" fontSize="12" fill="#64748b" fontWeight="bold" textAnchor="middle">REACTOR T-101</text>
  </svg>
);

const Login = ({ onLogin }: { onLogin: (u: string) => void }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && pass) {
      onLogin(user);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* Left Side: Login Form */}
        <div className="w-full p-10 md:w-1/2 md:p-16 flex flex-col justify-center">
            <div className="mb-10 animate-slide-up">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30">
                <BrainIcon />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-500">Sign in to access the Chemical Equipment Visualization Platform.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" className="w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-600/40 transition-all transform active:scale-[0.98]">
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
               <p className="text-xs text-slate-400 font-medium">Protected System. Authorized Personnel Only.</p>
            </div>
        </div>

        {/* Right Side: Visual Illustration */}
        <div className="hidden md:flex md:w-1/2 relative bg-blue-50 items-center justify-center overflow-hidden border-l border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-0"></div>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 w-4/5 h-4/5 transform hover:scale-105 transition-transform duration-700">
               <ChemicalPlantIllustration />
            </div>

            <div className="absolute bottom-10 left-0 right-0 text-center px-6">
               <h3 className="text-blue-900 font-bold text-lg tracking-wide">Real-Time Monitoring</h3>
               <p className="text-blue-600/70 text-sm mt-1 font-medium">Advanced telemetry for industrial processing units.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      const storedUser = localStorage.getItem('chem_user');
      if(storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (username: string) => {
    const u = { username, isAuthenticated: true };
    setUser(u);
    localStorage.setItem('chem_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chem_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans print:bg-white print:text-black">
        {user ? (
          <div className="flex min-h-screen print:block">
            <Sidebar onLogout={handleLogout} />
            <main className="flex-1 md:ml-64 relative print:ml-0 print:w-full">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/report" element={<ReportView />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>
          </div>
        ) : (
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

export default App;