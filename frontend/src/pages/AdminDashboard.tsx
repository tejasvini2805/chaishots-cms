import { useEffect, useState } from 'react';
import { api, formatDate } from '../lib/api';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    // Fetch ALL programs (CMS API)
    api.get('/api/programs').then(res => setPrograms(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            + New Program
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{prog.title}</div>
                    <div className="text-sm text-gray-500">{prog.languagePrimary}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${prog.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {prog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(prog.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link to={`/admin/program/${prog.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Manage Content →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}