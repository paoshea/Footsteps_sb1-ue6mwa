import React from 'react';
import { Filter, X } from 'lucide-react';
import { TagInput } from './TagInput';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestedTags?: string[];
  className?: string;
}

export function TagFilter({
  selectedTags,
  onTagsChange,
  suggestedTags = [],
  className,
}: TagFilterProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <Filter className="w-4 h-4 mr-1" />
          Filter by Tags
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={() => onTagsChange([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      <TagInput
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
        placeholder="Add tags to filter..."
      />

      {suggestedTags.length > 0 && (
        <div className="mt-2">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Suggested Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (!selectedTags.includes(tag)) {
                    onTagsChange([...selectedTags, tag]);
                  }
                }}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}