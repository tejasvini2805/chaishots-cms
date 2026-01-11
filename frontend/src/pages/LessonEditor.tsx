import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function LessonEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [publishAt, setPublishAt] = useState('');

  useEffect(() => {
    // NOW: We use the new internal API that sees everything
    api.get(`/api/lessons/${id}`)
      .then((res: any) => {
        const data = res.data.data; // The backend returns { data: lesson }
        setTitle(data.title);
        setStatus(data.status);
        
        // Format date for the input field (YYYY-MM-DDTHH:mm)
        if(data.publishAt) {
          setPublishAt(new Date(data.publishAt).toISOString().slice(0, 16));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lesson:", err);
        alert("Error loading lesson. Check backend console.");
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      await api.put(`/api/lessons/${id}`, {
        title,
        status,
        publishAt: status === 'SCHEDULED' ? publishAt : null
      });
      alert('Lesson Saved!');
      navigate(-1); // Go back to previous page
    } catch (err) {
      alert('Error saving lesson');
    }
  };

  if (loading) return <div className="p-8 text-xl">Loading lesson details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Lesson</h1>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published (Immediate)</option>
            </select>
          </div>

          {/* Schedule Time (Only if Scheduled) */}
          {status === 'SCHEDULED' && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <label className="block text-sm font-medium text-blue-800">Publish Date & Time</label>
              <input 
                type="datetime-local"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              />
              <p className="text-xs text-blue-600 mt-2">
                The Worker will auto-publish this lesson when the time arrives.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex justify-between">
            <button onClick={() => navigate(-1)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}