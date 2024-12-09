import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface TagCloudProps {
  tags: Array<{
    name: string;
    count: number;
  }>;
  onTagClick?: (tag: string) => void;
  maxTags?: number;
  className?: string;
}

export function TagCloud({
  tags,
  onTagClick,
  maxTags = 30,
  className,
}: TagCloudProps) {
  const maxCount = Math.max(...tags.map(tag => tag.count));
  const minCount = Math.min(...tags.map(tag => tag.count));
  const range = maxCount - minCount;

  const getTagSize = (count: number) => {
    const normalized = (count - minCount) / (range || 1);
    return 0.8 + normalized * 0.7; // Scale from 0.8 to 1.5
  };

  const sortedTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {sortedTags.map(({ name, count }) => (
        <button
          key={name}
          onClick={() => onTagClick?.(name)}
          className={clsx(
            'inline-flex items-center px-3 py-1 rounded-full',
            'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
            'transition-all duration-200'
          )}
          style={{
            transform: `scale(${getTagSize(count)})`,
          }}
        >
          <TagIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{name}</span>
          <span className="ml-1.5 text-xs text-indigo-500">({count})</span>
        </button>
      ))}
    </div>