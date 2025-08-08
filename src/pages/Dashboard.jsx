// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookmarkCard from '../components/BookmarkCard';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

// dnd-kit imports
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

function Dashboard({ toggleTheme }) {
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [filterTag, setFilterTag] = useState('All');
  const [saving, setSaving] = useState(false);

  // ---------------- dnd-kit sensors ----------------
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }, // small drag threshold to avoid click-drags
    })
  );

  // --------------- load & sort ---------------------
  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const sorted = [...res.data].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0) || a.createdAt.localeCompare(b.createdAt)
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

  // --------------- add bookmark --------------------
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
      toast.success('Bookmark added!');
    } catch (err) {
      console.error('Add error:', err);
      toast.error(err.response?.data?.message || 'Failed to add bookmark');
    }
  };

  // --------------- delete bookmark -----------------
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

  // --------------- filtering -----------------------
  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags || [])));
  const visible = filterTag === 'All' ? bookmarks : bookmarks.filter((b) => (b.tags || []).includes(filterTag));
  const visibleIds = visible.map((b) => b._id); // used by SortableContext

  // --------------- reorder & persist ---------------
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

    // compute indices in the FULL list (not just filtered),
    // so order is global and consistent even when filtering
    const fromIndex = bookmarks.findIndex((b) => b._id === active.id);
    const toIndex = bookmarks.findIndex((b) => b._id === over.id);

    const newOrder = arrayMove(bookmarks, fromIndex, toIndex)
      .map((b, position) => ({ ...b, position }));
    setBookmarks(newOrder);
    persistOrder(newOrder);
  };

  // --------------- logout --------------------------
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6">
      {/* Header */}
      {/* Use the Navbar up top */}
      <Navbar toggleTheme={toggleTheme} />

      {/* Add form */}
      <form onSubmit={addBookmark} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="url"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex-1 p-2 rounded border dark:bg-gray-700"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full sm:w-80 p-2 rounded border dark:bg-gray-700"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      {/* Filter */}
      {allTags.length > 0 && (
        <div className="mb-4">
          <label className="mr-2 font-semibold">Filter by tag:</label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700"
          >
            <option value="All">All</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      )}

      {saving && <div className="text-sm text-gray-500 mb-2">Saving order…</div>}

      {/* TRUE 2-D GRID DND */}
      {/* TRUE 2-D GRID DND */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visibleIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[20px]">
            {visible.length === 0 ? (
              <p className="text-center col-span-full text-gray-400">No bookmarks yet.</p>
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
  );
}

export default Dashboard;

/* ------------ Sortable wrapper for a card ------------- */
function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // optional visual flair while dragging
    boxShadow: isDragging ? '0 10px 24px rgba(0,0,0,0.15)' : undefined,
    // while dragging, prevent inner anchors from hijacking pointer
    pointerEvents: isDragging ? 'none' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
