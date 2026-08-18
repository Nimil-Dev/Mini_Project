import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiLayers, FiCalendar } from 'react-icons/fi';
import analyticsService from '../../services/analyticsService';

// Register all required Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [timeframe, setTimeframe] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const metricsRes = await analyticsService.getOverviewMetrics();
      const trendsRes = await analyticsService.getTrendData(timeframe);
      setMetrics(metricsRes.cards);
      setTrendData(trendsRes);
      setLoading(false);
    }
    loadDashboardData();
  }, [timeframe]);

  if (loading || !trendData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Configuration for the Activity Trend Line Chart
  const lineChartData = {
    labels: trendData.timelineLabels,
    datasets: [
      {
        label: 'User Activity Index',
        data: trendData.activityDataset,
        borderColor: '#3b82f6', // Tailwind blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointHoverRadius: 7,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#9ca3af', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 10 } }
      }
    }
  };

  // Configuration for Category Doughnut Chart
  const doughnutChartData = {
    labels: trendData.categoryDistribution.labels,
    datasets: [
      {
        data: trendData.categoryDistribution.data,
        backgroundColor: ['#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'], // Emerald, Amber, Purple, Blue
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 11 },
          color: '#6b7280'
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Canvas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiActivity className="text-blue-500" />
            <span>Platform Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor real-time system check-ins, event engagements, and student completion curves.
          </p>
        </div>

        {/* Timeframe selector controls */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
          {['weekly', 'monthly'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors
                ${timeframe === t 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card, idx) => (
          <div 
            key={idx} 
            className="p-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {card.label}
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
                {card.value}
              </span>
              <span className={`text-[10px] font-extrabold flex items-center gap-0.5 px-2 py-0.5 rounded-full
                ${card.isPositive 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                }
              `}>
                {card.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Layout Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Line Chart */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiCalendar className="text-blue-500" />
              <span>Engagement Index Trend</span>
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">Tuned to active session loads</span>
          </div>
          <div className="h-64 relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Categories Distribution Doughnut Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FiLayers className="text-indigo-500" />
              <span>Event Distribution</span>
            </h3>
            <p className="text-[10px] text-slate-400">Activity weighted by registered category divisions</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;