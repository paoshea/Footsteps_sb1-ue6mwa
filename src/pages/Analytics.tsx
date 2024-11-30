import React, { useState } from 'react';
import {
  BarChart,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { GrowthMetrics } from '../components/analytics/GrowthMetrics';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { TeamContributionMap } from '../components/analytics/TeamContributionMap';
import { useAnalyticsStore } from '../store/useAnalyticsStore';

const mockContributions = [
  {
    userId: '1',
    name: 'Sarah Chen',
    department: 'Engineering',
    contributions: 156,
    impact: 87,
    recentActivity: [
      'Completed Project X migration',
      'Mentored 3 junior developers',
      'Led architecture review',
    ],
  },
  {
    userId: '2',
    name: 'Michael Park',
    department: 'Product',
    contributions: 98,
    impact: 72,
    recentActivity: [
      'Launched new feature',
      'Conducted user research',
      'Updated product roadmap',
    ],
  },
  {
    userId: '3',
    name: 'Emma Wilson',
    department: 'Design',
    contributions: 64,
    impact: 45,
    recentActivity: [
      'Created design system',
      'UI/UX improvements',
      'Brand guidelines update',
    ],
  },
];

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { departmentComparisons, fetchAnalytics } = useAnalyticsStore();

  React.useEffect(() => {
    fetchAnalytics();
  }, [timeRange, fetchAnalytics]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <BarChart className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Growth Analytics</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2 text-gray-400" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <GrowthMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={departmentComparisons} />
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">Strong Growth</h4>
                <p className="text-sm text-green-600">
                  Team size increased by 32% with 90% retention rate
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800">Areas for Improvement</h4>
                <p className="text-sm text-yellow-600">
                  Cross-department collaboration could be strengthened
                </p>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-800">Trending Up</h4>
                <p className="text-sm text-indigo-600">
                  Milestone completion rate improved by 25%
                </p>
              </div>
            </div>
          </div>
        </div>

        <TeamContributionMap contributions={mockContributions} />
      </div>
    </div>
  );
}