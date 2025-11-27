import React from 'react';
import { Download, Trash2, X, Table } from 'lucide-react';
import { StudentSubmission, Question } from '../types';
import { QUESTIONS } from '../constants';

interface TeacherDashboardProps {
  submissions: StudentSubmission[];
  onClose: () => void;
  onClearData: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ submissions, onClose, onClearData }) => {
  
  const downloadCSV = () => {
    if (submissions.length === 0) return;

    // Create CSV Header
    const headers = ['Nom', 'Data', ...QUESTIONS.map(q => q.text)].join(',');
    
    // Create CSV Rows
    const rows = submissions.map(sub => {
      const rowData = [
        `"${sub.studentName}"`,
        `"${new Date(sub.date).toLocaleDateString()}"`,
        ...QUESTIONS.map(q => {
          const answer = sub.responses.find(r => r.questionId === q.id);
          let val = answer?.value || '';
          // Convert numeric Likert to text for better readability in CSV
          if (typeof val === 'number') {
            if (val === 1) val = 'Caldria millorar (1)';
            if (val === 2) val = 'Regular (2)';
            if (val === 3) val = 'Bé (3)';
            if (val === 4) val = 'Molt bé (4)';
          }
          // Escape quotes in text answers
          return `"${String(val).replace(/"/g, '""')}"`;
        })
      ];
      return rowData.join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `autoavaluacio_resultats_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Table className="h-6 w-6" />
            <h2 className="text-xl font-bold">Panell de la Mestra</h2>
          </div>
          <button onClick={onClose} className="hover:bg-indigo-700 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">Encara no hi ha respostes guardades.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600 min-w-[150px]">Alumne</th>
                    <th className="p-4 font-semibold text-gray-600 min-w-[100px]">Data</th>
                    {QUESTIONS.map(q => (
                      <th key={q.id} className="p-4 font-semibold text-gray-600 min-w-[200px] text-xs">
                        {q.text.length > 30 ? q.text.substring(0, 30) + '...' : q.text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-indigo-900">{sub.studentName}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(sub.date).toLocaleDateString()}</td>
                      {QUESTIONS.map(q => {
                        const val = sub.responses.find(r => r.questionId === q.id)?.value;
                        return (
                          <td key={q.id} className="p-4 text-sm text-gray-700">
                            {typeof val === 'number' ? (
                              <span className={`
                                inline-block px-2 py-1 rounded-full font-bold text-xs
                                ${val === 4 ? 'bg-green-100 text-green-700' : 
                                  val === 3 ? 'bg-lime-100 text-lime-700' :
                                  val === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-red-100 text-red-700'}
                              `}>
                                {val}/4
                              </span>
                            ) : (
                              <span className="italic text-gray-500 line-clamp-2" title={String(val)}>
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={onClearData}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            <Trash2 size={18} />
            Esborrar totes les dades
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={downloadCSV}
              disabled={submissions.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
            >
              <Download size={20} />
              Descarregar Excel (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};