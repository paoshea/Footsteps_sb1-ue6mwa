import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, MessageSquare, Award, Flag } from 'lucide-react';
import type { TeamActivity } from '../../../types/team';

interface ActivityFeedProps {
  activities: TeamActivity[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
  const getActivityIcon = (type: TeamActivity['type']) => {
    switch (type) {
      case 'memory':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'milestone':
        return <Flag className="h-5 w-5 text-green-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        {activities.length > maxItems && (
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            View All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.details.title}
                </p>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {activity.details.description}
              </p>
              {activity.details.impact && (
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Impact Score: {activity.details.impact}
                </span>
              )}
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No recent activity to show
          </div>
        )}
      </div>
    </div>
  );
}