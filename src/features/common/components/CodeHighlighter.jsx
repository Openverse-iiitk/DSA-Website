/**
 * Enhanced CodeHighlighter Component
 * 
 * A unified, optimized syntax highlighter component used across all visualizers.
 * Provides consistent styling, line highlighting, and performance optimizations.
 * 
 * Features:
 * - Syntax highlighting for multiple languages
 * - Current line highlighting during animations
 * - Auto-scrolling to highlighted lines
 * - Performance optimized with React.memo
 * - Consistent theming across the application
 * 
 * Usage:
 * import { CodeHighlighter } from '../../../features/common/components/CodeHighlighter';
 */

import React, { useRef, useEffect, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * Enhanced CodeHighlighter component with line highlighting and auto-scroll
 * @param {string} code - The code to highlight
 * @param {number} currentLine - The currently executing line (1-indexed)
 * @param {string} language - Programming language for syntax highlighting
 * @param {boolean} showLineNumbers - Whether to show line numbers
 * @param {object} customStyle - Additional custom styles
 */
const CodeHighlighter = memo(({ 
  code, 
  currentLine = null, 
  language = 'cpp',
  showLineNumbers = true,
  customStyle = {} 
}) => {
  const codeContainerRef = useRef(null);
  
  /**
   * Custom line renderer for highlighting current line
   * @param {number} lineNumber - Line number (1-indexed)
   * @returns {object} Line props with conditional highlighting
   */
  const getLineProps = (lineNumber) => {
    const baseStyle = {
      display: 'block',
      padding: '0 0.5rem',
      width: '100%',
      transition: 'all 0.2s ease-in-out', // Smooth transition for highlighting
    };
    
    // Highlight the currently executing line
    if (currentLine === lineNumber) {
      return {
        style: {
          ...baseStyle,
          backgroundColor: 'rgba(0, 212, 170, 0.25)', // Using theme primary color
          borderLeft: '4px solid var(--color-primary, #00D4AA)',
          paddingLeft: '1rem',
          fontWeight: 'bold',
          color: '#ffffff',
          boxShadow: 'inset 0 0 10px rgba(0, 212, 170, 0.1)',
        },
        className: 'highlight-line',
      };
    }
    
    return { style: baseStyle };
  };
  
  /**
   * Auto-scroll to highlighted line with smooth animation
   */
  useEffect(() => {
    if (!code || !currentLine || !codeContainerRef.current) return;
    
    // Use requestAnimationFrame for smooth scrolling
    const scrollToLine = () => {
      const highlightedLine = codeContainerRef.current?.querySelector('.highlight-line');
      
      if (highlightedLine) {
        const container = codeContainerRef.current.querySelector('pre');
        if (container) {
          const lineTop = highlightedLine.offsetTop;
          const containerHeight = container.clientHeight;
          const scrollTop = lineTop - (containerHeight / 2);
          
          // Smooth scroll to center the highlighted line
          container.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToLine, 100);
    return () => clearTimeout(timeoutId);
  }, [code, currentLine]);

  // Hooks must run in the same order even when the code prop is empty.
  if (!code) return null;
  
  // Custom theme based on our application's color scheme
  const customTheme = {
    ...atomDark,
    'pre[class*="language-"]': {
      ...atomDark['pre[class*="language-"]'],
      background: 'var(--color-card-bg, #1A1A2E)',
      border: '1px solid var(--color-border, #333)',
      borderRadius: '8px',
      margin: 0,
      padding: '1rem',
      maxHeight: '400px',
      overflow: 'auto',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--color-primary, #00D4AA) transparent',
    },
    'code[class*="language-"]': {
      ...atomDark['code[class*="language-"]'],
      color: 'var(--color-text, #ffffff)',
      fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
    },
  };
  
  return (
    <div 
      ref={codeContainerRef}
      className="code-highlighter-container"
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--color-border, #333)',
        ...customStyle
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={customTheme}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={{
          color: 'var(--color-text-secondary, #888)',
          fontSize: '0.8rem',
          paddingRight: '1rem',
          minWidth: '3rem',
          textAlign: 'right',
        }}
        lineProps={getLineProps}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          border: 'none',
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

// Set display name for better debugging
CodeHighlighter.displayName = 'CodeHighlighter';

export default CodeHighlighter;
