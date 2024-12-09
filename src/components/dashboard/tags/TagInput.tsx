import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagIcon, X } from 'lucide-react';
import { useTagStore } from '../../store/useTagStore';

interface TagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  selectedTags,
  onTagsChange,
  placeholder = 'Add tags...',
  maxTags = 10,
  className = '',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { suggestedTags, frequentTags } = useTagStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsDropdownOpen(true);
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (
      normalizedTag &&
      !selectedTags.includes(normalizedTag) &&
      selectedTags.length < maxTags
    ) {
      onTagsChange([...selectedTags, normalizedTag]);
    }
    setInput('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const filteredSuggestions = suggestedTags
    .filter(tag => 
      tag.toLowerCase().includes(input.toLowerCase()) &&
      !selectedTags.includes(tag.toLowerCase())
    )
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
          >
            <TagIcon className="w-4 h-4 mr-1" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-indigo-200"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>

      {isDropdownOpen && (input || frequentTags.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
        >
          {input && filteredSuggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Suggestions
              </div>
              {filteredSuggestions.map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          
          {!input && frequentTags.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Frequent Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {frequentTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    <TagIcon className="w-4 h-4 mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}