import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { getMyTimetable } from '../services/studentUserService';

const StudentTimetable = () => {
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await getMyTimetable();
      setTimetable(data);
    } catch (error) {
      console.error('Failed to load timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDay = (timetable) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grouped = {};
    
    days.forEach(day => {
      grouped[day] = timetable.filter(item => item.dayOfWeek === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    
    return grouped;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div>;
  }

  const groupedTimetable = groupByDay(timetable);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-gray-800">My Timetable</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {timetable.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Timetable Available</h3>
            <p className="text-gray-600">Your class timetable will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {Object.entries(groupedTimetable).map(([day, periods]) => (
              <div key={day} className="bg-white rounded-lg shadow">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
                  <h3 className="font-semibold text-center">{day}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {periods.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No classes</p>
                  ) : (
                    periods.map((period) => (
                      <div key={period.id} className="border-l-4 border-blue-400 pl-3 py-2">
                        <div className="font-semibold text-sm text-gray-900">{period.subject}</div>
                        <div className="text-xs text-gray-600">
                          {period.startTime} - {period.endTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {period.teacher} • {period.room}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentTimetable;