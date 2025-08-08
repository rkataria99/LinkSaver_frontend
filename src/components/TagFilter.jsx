import React from 'react';

function TagFilter({ tags, selectedTag, setSelectedTag }) {
  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      <button
        className={`px-3 py-1 rounded ${selectedTag === '' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        onClick={() => setSelectedTag('')}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`px-3 py-1 rounded ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default TagFilter;
