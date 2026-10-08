import {motion} from 'framer-motion';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

import { 
  FaGithub, 
  FaHome, 
  FaSearch, 
  FaFilter, 
  FaArrowLeft,
  FaExternalLinkAlt,
  FaStar,
  FaClock,
  FaTags,
  FaSort,
  FaListUl,
  FaThLarge
} from 'react-icons/fa';
import '../styles/Archive.css';
import logo from '../../../assets/openverse2.svg';
import { leetCodeData } from '../data/leetCodeData';
import { iiitk_pyqData } from '../data/iiitk_pyqData';

const Archive = () => {
  const { topic } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Determine if this is a PYQ route
  const isPYQ = window.location.pathname.includes('/pyq/');
  const data = isPYQ ? iiitk_pyqData : leetCodeData;
  
  // Get topic data
  const topicData = data[topic];
  
  // Generate available tags from the data
  const availableTags = useMemo(() => {
    if (!topicData?.questions) {
      return [];
    }
    const tags = new Set();
    topicData.questions.forEach(q => {
      if (q.tags) {
        q.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [topicData]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    if (!topicData?.questions) {
      return [];
    }

    let filtered = topicData.questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          question.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               question.difficulty.toLowerCase() === selectedDifficulty;
      
      const matchesTags = selectedTags.length === 0 || 
                         (question.tags && selectedTags.some(tag => question.tags.includes(tag)));

      return matchesSearch && matchesDifficulty && matchesTags;
    });

    // Sort questions
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'difficulty':
          {
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          aValue = difficultyOrder[a.difficulty.toLowerCase()];
          bValue = difficultyOrder[b.difficulty.toLowerCase()];
          break;
          }
        case 'date':
          aValue = new Date(a.dateAdded || '2024-01-01');
          bValue = new Date(b.dateAdded || '2024-01-01');
          break;
        default:
          aValue = a[sortBy]?.toLowerCase();
          bValue = b[sortBy]?.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [topicData, searchTerm, selectedDifficulty, selectedTags, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDifficulty, selectedTags, sortBy, sortOrder]);

  if (!topicData) {
    return (
      <div className="archive-page">
        <div className="archive-bg-overlay"></div>
        <div className="archive-container">
          <div className="archive-error">
            <h2>Topic Not Found</h2>
            <p>The topic "{topic}" is not available yet.</p>
            <Link to="/" className="archive-back-btn">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('all');
    setSelectedTags([]);
    setSortBy('title');
    setSortOrder('asc');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '#00ff88';
      case 'medium': return '#ffb000';
      case 'hard': return '#ff375f';
      default: return '#a78bfa';
    }
  };

  return (
    <div className="archive-page">
      <div className="archive-bg-overlay"></div>
      
      {/* Header */}
      <header className="archive-header">
        <div className="archive-header-content">
          <div className="archive-logo">
            <Link to="/">
              <img src={logo} alt="Openverse logo" />
              <span>Openverse</span>
            </Link>
          </div>
          
          <div className="archive-breadcrumb">
            <Link to="/" className="breadcrumb-item">
              <FaHome size={16} />
            </Link>
            <span className="breadcrumb-separator">•</span>
            <Link to="/archive" className="breadcrumb-item">Archive</Link>
            <span className="breadcrumb-separator">•</span>
            <span className="breadcrumb-current">
              {isPYQ ? 'IIITK PYQ' : 'LeetCode'} - {topicData.title}
            </span>
          </div>

          <div className="archive-nav">
            <Link to="/quiz" className="archive-nav-link">Quiz</Link>
            <Link to="/about" className="archive-nav-link">About</Link>
            <a
              href="https://github.com/Openverse-iiitk/DSA-Website"
              target="_blank"
              rel="noopener noreferrer"
              className="archive-nav-link"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </header>

      <main className="archive-main">
        {/* Topic Header */}
        <motion.div 
          className="archive-topic-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="topic-header-content">
            <h1 className="topic-title">
              {topicData.title}
              <span className="topic-badge">
                {isPYQ ? 'IIITK PYQs' : 'LeetCode'}
              </span>
            </h1>
            <p className="topic-description">{topicData.description}</p>
            <div className="topic-stats">
              <span className="stat">
                <FaListUl /> {filteredQuestions.length} Questions
              </span>
              {availableTags.length > 0 && (
                <span className="stat">
                  <FaTags /> {availableTags.length} Tags
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div 
          className="archive-controls"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="controls-row">
            {/* Search Bar */}
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FaListUl />
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FaThLarge />
              </button>
            </div>
          </div>

          <div className="controls-row">
            {/* Difficulty Filter */}
            <div className="filter-group">
              <label>Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="date">Date Added</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="sort-order-btn"
              >
                <FaSort /> {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Clear Filters */}
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="tags-filter">
              <label>Tags:</label>
              <div className="tags-container">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Questions List/Grid */}
        <motion.div 
          className={`archive-content ${viewMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {paginatedQuestions.length === 0 ? (
            <div className="no-results">
              <h3>No questions found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className={`questions-${viewMode}`}>
              {paginatedQuestions.map((question, index) => (
                <motion.div
                  key={question.id || index}
                  className="question-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="question-header">
                    <h3 className="question-title">{question.title}</h3>
                    <div className="question-meta">
                      <span 
                        className="difficulty-badge"
                        style={{ color: getDifficultyColor(question.difficulty) }}
                      >
                        {question.difficulty}
                      </span>
                      {question.dateAdded && (
                        <span className="date-badge">
                          <FaClock size={12} />
                          {new Date(question.dateAdded).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {question.description && (
                    <p className="question-description">{question.description}</p>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="question-tags">
                      {question.tags.map(tag => (
                        <span key={tag} className="question-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="question-actions">
                    {question.leetcodeUrl && (
                      <a
                        href={question.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn primary"
                      >
                        <FaExternalLinkAlt size={14} />
                        Solve on LeetCode
                      </a>
                    )}
                    {question.solutionUrl && (
                      <a
                        href={question.solutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn secondary"
                      >
                        <FaStar size={14} />
                        View Solution
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Archive;
