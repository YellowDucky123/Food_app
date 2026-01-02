import { useState } from 'react'
import { Checkbox } from "./components/base/checkbox/checkbox";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, location: 'Alam Sutera', db_name: ["Alsut"], picked: false },
    { id: 2, location: 'Gading Serpong', db_name: ["GS"], picked: false },
    { id: 3, location: 'BSD', db_name: ["BSD"], picked: false },
	{ id: 4, location: 'PIK', db_name: ["PIK"], picked: false },
	// { id: 5, location: 'Bandung', db_name: ["Bandung"], picked: false },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, picked: !t.picked } : t))
  }

  const navigate = useNavigate();
  const get_foods = async (locations: string[]) => {
  	navigate(`/foods/${locations}`);
  }

  return (
    <>
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Food App</h1>
        </div>

        {/* Task List */}
        <div className="space-y-4 mb-8">
          {tasks.map((item) => (
		     <div
			    key={item.id}
				className="flex items-center p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-all group"
			 >
		     <Checkbox label={item.location} size="md" onChange={() => toggleTask(item.id)}/>
		  	 </div>
		  ))}
        </div>

        {/* Supabase Action */}
        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={() => {
				const selectedLocations = tasks
					.filter(task => task.picked)
					.map(task => task.db_name)
					.flat(1);
				
				if (selectedLocations.length > 0) {
					get_foods(selectedLocations);
				} else {
					console.log("No locations selected");
					console.log(tasks);
				}
			}}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
          >
            Query
          </button>
        </div>

      </div>
    </div>
	</>
  )
}
