import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Catalog() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    // Fetch published programs from backend
    api.get('/catalog/programs')
      .then((res) => setPrograms(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Public Course Catalog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Show Poster if available */}
            {program.assets?.[0]?.url && (
              <img 
                src={program.assets[0].url} 
                alt={program.title} 
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{program.title}</h2>
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {program.languagePrimary.toUpperCase()}
                </span>
                <span>Published: {new Date(program.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {programs.length === 0 && (
        <p className="text-center text-gray-500">No published programs found.</p>
      )}
    </div>
  );
}