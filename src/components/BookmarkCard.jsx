import React from 'react';

function BookmarkCard({ bookmark, onDelete }) {
  const { url, title, tags = [], markdownContent, summary } = bookmark;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
      {/* Clickable Title or URL */}
      <h3 className="text-lg font-semibold break-words">
        <a
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {title || url}
        </a>
      </h3>

      {/* Plain URL as desc */}
      <p className="text-sm text-gray-500 break-words">{url}</p>

      {/* Markdown content */}
      {markdownContent && (
        <p className="mt-2 text-gray-700 dark:text-gray-300">{markdownContent}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          Tags: {tags.join(', ')}
        </p>
      )}

      {/* AI Summary */}
      {summary && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          <span className="font-medium">Summary: </span>
          {summary.length > 300 ? summary.substring(0, 300) + '...' : summary}
        </p>
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
