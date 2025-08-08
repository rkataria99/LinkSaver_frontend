// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarkCard from '../components/BookmarkCard';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Dashboard() {
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [filterTag, setFilterTag] = useState('All');
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // NEW: search state
  const [search, setSearch] = useState('');

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // load & sort
  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const sorted = [...res.data].sort(
        (a, b) =>
          (a.position ?? 0) - (b.position ?? 0) ||
          a.createdAt.localeCompare(b.createdAt)
      );
      setBookmarks(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching bookmarks');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // add bookmark (used by modal form)
  const addBookmark = async (e) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      const strippedUrl = url.replace(/^https?:\/\//, '');
      const encodedUrl = encodeURIComponent(strippedUrl);
      const summary = await fetch(`https://r.jina.ai/http://${encodedUrl}`).then((res) => res.text());

      const res = await axios.post(
        'http://localhost:5000/api/bookmarks',
        { url, tags, summary },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setBookmarks((prev) => [res.data, ...prev]);
      setUrl('');
      setTagsInput('');
      setShowAdd(false);
      toast.success('Bookmark added!');
      fetchBookmarks(); // ensure latest from server
    } catch (err) {
      console.error('Add error:', err);
      toast.error(err.response?.data?.message || 'Failed to add bookmark');
    }
  };

  // delete
  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      toast.success('Bookmark deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // tags + filtering
  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags || [])));

  const applyFilters = (list) => {
    let out = list;
    if (filterTag !== 'All') {
      out = out.filter((b) => (b.tags || []).includes(filterTag));
    }

    const q = search.trim().toLowerCase();
    if (q) {
      // Match at the start of a word in summary (word-boundary prefix)
      const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const prefixRe = new RegExp(`\\b${esc}`, 'i');

      out = out.filter((b) => {
        const title = (b.title || '').toLowerCase();
        const urlStr = (b.url || '').toLowerCase();
        const summary = b.summary || '';

        return (
          title.includes(q) ||            // anywhere in title
          urlStr.includes(q) ||           // anywhere in URL
          prefixRe.test(summary)          // prefix at ANY word in summary
        );
      });
    }

    return out;
  };


  const visible = applyFilters(bookmarks);
  const visibleIds = visible.map((b) => b._id);

  // reorder & persist
  const persistOrder = async (list) => {
    const updates = list.map((b, position) => ({ _id: b._id, position }));
    try {
      setSaving(true);
      await axios.put(
        'http://localhost:5000/api/bookmarks/reorder',
        { updates },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Order updated');
    } catch (e) {
      console.error('Reorder failed', e);
      toast.error('Failed to update order');
      fetchBookmarks();
    } finally {
      setSaving(false);
    }
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const fromIndex = bookmarks.findIndex((b) => b._id === active.id);
    const toIndex = bookmarks.findIndex((b) => b._id === over.id);
    const newOrder = arrayMove(bookmarks, fromIndex, toIndex).map((b, position) => ({ ...b, position }));
    setBookmarks(newOrder);
    persistOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Navbar with Add button that opens the modal */}
      <Navbar onAddClick={() => setShowAdd(true)} />

      <div className="w-full px-3 sm:px-4 lg:px-6 py-6">
        {/* Search bar at the top */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, URL, or summary..."
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
            />
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
            >
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Tag chips instead of dropdown */}
        {allTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <TagChip
              label="All"
              active={filterTag === 'All'}
              onClick={() => setFilterTag('All')}
            />
            {allTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                active={filterTag === tag}
                onClick={() => setFilterTag(tag)}
              />
            ))}
          </div>
        )}

        {saving && <div className="text-sm text-gray-500 mb-2">Saving order…</div>}

        {/* Grid + DnD */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {visible.length === 0 ? (
                <p className="text-center col-span-full text-gray-400">No bookmarks found.</p>
              ) : (
                visible.map((b) => (
                  <SortableCard key={b._id} id={b._id}>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                      <BookmarkCard bookmark={b} onDelete={() => deleteBookmark(b._id)} />
                    </div>
                  </SortableCard>
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add Bookmark Modal */}
      {showAdd && (
        <AddBookmarkModal
          url={url}
          tagsInput={tagsInput}
          setUrl={setUrl}
          setTagsInput={setTagsInput}
          onClose={() => setShowAdd(false)}
          onSubmit={addBookmark}
        />
      )}
    </div>
  );
}

export default Dashboard;

/* ------------ TagChip ------------- */
function TagChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ' +
        (active
          ? 'bg-blue-600 text-white shadow'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600')
      }
    >
      {label}
    </button>
  );
}


/* ------------ Modal Component ------------- */
function AddBookmarkModal({ url, tagsInput, setUrl, setTagsInput, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* dialog */}
      <div className="relative w-full max-w-lg rounded-xl bg-white p-5 shadow-lg dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Bookmark</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full rounded border p-2 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="news, ai"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded border p-2 dark:bg-gray-700"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 text-sm dark:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------ Sortable wrapper for a card ------------- */
function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging ? '0 10px 24px rgba(0,0,0,0.15)' : undefined,
    pointerEvents: isDragging ? 'none' : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
