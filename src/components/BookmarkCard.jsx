import React, { useState } from 'react';

function BookmarkCard({ bookmark, onDelete }) {
  const { url, title, tags = [], markdownContent, summary } = bookmark;
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md break-words">
      {/* Clickable Title or URL */}
      <h3 className="text-lg font-semibold break-words">
        <a
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >
          {title || url}
        </a>
      </h3>

      {/* Plain URL */}
      <p className="text-sm text-gray-500 break-all">{url}</p>

      {/* Markdown content */}
      {markdownContent && (
        <p className="mt-2 text-gray-700 dark:text-gray-300">{markdownContent}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">Tags: {tags.join(', ')}</p>
      )}

      {/* AI Summary */}
      {summary && (
        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
          <span className="font-medium">Summary: </span>
          <span
            className={!showFull ? 'line-clamp-5' : ''}
          >
            {summary}
          </span>
          {summary.length > 200 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-2 text-blue-500 hover:underline text-xs"
            >
              {showFull ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Delete Button */}
      <div className="mt-3">
        <button
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => onDelete(bookmark._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookmarkCard;
