import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface InsightCardProps {
  title: string;
  description: string;
  metrics?: {
    label: string;
    value: number;
    change: number;
  }[];
  type?: 'success' | 'warning' | 'info';
  className?: string;
}

export function InsightCard({
  title,
  description,
  metrics,
  type = 'info',
  className,
}: InsightCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={clsx('rounded-lg border p-6', getTypeStyles(), className)}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Lightbulb className={clsx('h-6 w-6', {
            'text-green-600': type === 'success',
            'text-yellow-600': type === 'warning',
            'text-blue-600': type === 'info',
          })} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-600">{description}</p>

          {metrics && metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{metric.label}</span>
                    <div className={clsx('flex items-center text-sm', {
                      'text-green-600': metric.change > 0,
                      'text-red-600': metric.change < 0,
                      'text-gray-600': metric.change === 0,
                    })}>
                      {metric.change > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : metric.change < 0 ? (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      ) : null}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">{metric.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>