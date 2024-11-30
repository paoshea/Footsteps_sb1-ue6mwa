import React, { useState } from 'react';
import { BookOpen, Search, Plus, Filter } from 'lucide-react';
import { ArticleCard } from '../components/knowledge/ArticleCard';
import { CreateArticleModal } from '../components/knowledge/CreateArticleModal';
import { ArticleView } from '../components/knowledge/ArticleView';
import { useKnowledgeStore } from '../store/useKnowledgeStore';
import type { KnowledgeArticle } from '../types';

export function Knowledge() {
  const { articles } = useKnowledgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const categories = ['Engineering', 'Product', 'Design', 'Culture', 'Process'];

  const filteredArticles = articles.filter(
    (article) =>
      (selectedCategory === 'all' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  if (selectedArticle) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <ArticleView
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onEdit={() => {/* Handle edit */}}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Article
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => setSelectedArticle(article)}
          />
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>

      <CreateArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}