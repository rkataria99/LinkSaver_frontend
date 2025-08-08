import React, { useState } from 'react';

function BookmarkCard({ bookmark, onDelete }) {
  const { url, title, tags = [], markdownContent, summary } = bookmark;
  const [open, setOpen] = useState(false); // modal for full content
  React.useEffect(() => {
  if (!open) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = prev; };
}, [open]);

  const displayUrl = url?.startsWith('http') ? url : `https://${url}`;

  return (
    <div className="h-full flex flex-col rounded-lg bg-white dark:bg-gray-800 shadow p-4">
      {/* Title */}
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline line-clamp-1 break-all">
        <a href={displayUrl} target="_blank" rel="noopener noreferrer">
          {title || url}
        </a>
      </h3>

      {/* URL */}
      <p className="mt-1 text-sm text-gray-500 line-clamp-1 break-all">{url}</p>

      {/* Markdown content (clamped) */}
      {markdownContent && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 break-words">
          {markdownContent}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <p className="mt-2 text-xs text-gray-400 line-clamp-1">
          <span className="font-medium text-gray-500 dark:text-gray-300">Tags: </span>
          {tags.join(', ')}
        </p>
      )}

      {/* Summary */}
      {summary && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 break-words">
          <span className="font-medium">Summary: </span>
          <span className="line-clamp-5 align-top">{summary}</span>
          {summary.length > 180 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ml-2 text-blue-500 hover:underline text-xs"
            >
              Show more
            </button>
          )}
        </div>
      )}

      {/* Spacer so delete sits at bottom */}
      <div className="flex-1" />

      {/* Delete */}
      <div className="mt-3">
        <button
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => onDelete(bookmark._id)}
        >
          Delete
        </button>
      </div>

      {/* Modal for full content */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-900 p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Bookmark details</h4>
              <button
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase text-gray-500 mb-1">Title</div>
                <div className="break-words">{title || url}</div>
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500 mb-1">URL</div>
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 break-all"
                >
                  {url}
                </a>
              </div>

              {tags.length > 0 && (
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Tags</div>
                  <div className="break-words">{tags.join(', ')}</div>
                </div>
              )}

              {markdownContent && (
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Markdown</div>
                  <pre className="whitespace-pre-wrap break-words text-sm">
                    {markdownContent}
                  </pre>
                </div>
              )}

              {summary && (
                <div>
                  <div className="text-xs uppercase text-gray-500 mb-1">Summary</div>
                  <pre className="whitespace-pre-wrap break-words text-sm">
                    {summary}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookmarkCard;
