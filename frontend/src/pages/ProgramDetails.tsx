import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function ProgramDetails() {
  const { id } = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Fetching details for ID:", id); // DEBUG LOG
    api.get(`/api/programs/${id}`)
      .then(res => {
        console.log("Data received:", res.data); // DEBUG LOG
        setProgram(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching:", err); // DEBUG LOG
        setError('Failed to load program. Check backend console.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-xl">Loading program details...</div>;
  if (error) return <div className="p-8 text-red-600 font-bold">{error}</div>;
  if (!program) return <div className="p-8">No program found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/admin/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold mt-2 text-gray-900">{program?.title || 'Untitled'}</h1>
          <p className="text-gray-600">{program?.description}</p>
        </div>

        <div className="space-y-6">
          {/* Check if terms exist before mapping */}
          {program.terms && program.terms.length > 0 ? (
            program.terms.map((term: any) => (
              <div key={term.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-semibold text-gray-700">
                  Term {term.termNumber}: {term.title}
                </div>
                
                <div className="divide-y divide-gray-100">
                  {term.lessons && term.lessons.map((lesson: any) => (
                    <div key={lesson.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                      <div>
                        <span className="font-medium text-gray-800">Lesson {lesson.lessonNumber}: {lesson.title}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Status: <span className={`font-semibold ${lesson.status === 'PUBLISHED' ? 'text-green-600' : 'text-orange-500'}`}>{lesson.status}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/admin/lesson/${lesson.id}`}
                        className="text-sm border border-blue-200 text-blue-700 px-3 py-1 rounded hover:bg-blue-50"
                      >
                        Edit / Schedule
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded">No terms or lessons found for this program.</div>
          )}
        </div>
      </div>
    </div>
  );
}