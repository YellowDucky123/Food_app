import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function FoodsPage() {	
  const { locations } = useParams();
  const [foods, setFoods] = useState<any[]>([]); // Store your results here
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      // Convert the URL string back into an array for the Edge Function
      const locationArray = locations ? locations.split(',') : [];

      const { data, error } = await supabase.functions.invoke('bright-service', {
        body: { locations: locationArray },
      });

      if (!error && data) {
        setFoods(data);
      }
      setLoading(false);
    };

    fetchFoods();
  }, [locations]);

  if (loading) return (
  		<div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
		  <div className="flex animate-pulse space-x-4">
			<div className="size-10 rounded-full bg-gray-200"></div>
			<div className="flex-1 space-y-6 py-1">
			  <div className="h-2 rounded bg-gray-200"></div>
			  <div className="space-y-3">
				<div className="grid grid-cols-3 gap-4">
				  <div className="col-span-2 h-2 rounded bg-gray-200"></div>
				  <div className="col-span-1 h-2 rounded bg-gray-200"></div>
				</div>
				<div className="h-2 rounded bg-gray-200"></div>
			  </div>
			</div>
		  </div>
		</div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
	 <div className="pt-6 border-t border-slate-800">
       <button
         onClick={() => {
		 	navigate('/');	
		 }}
         className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
      >
            Back to Dashboard
     	  </button>
        </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Available Foods</h1>
        <p className="text-slate-400">Showing results for: {locations?.replace(/,/g, ', ')}</p>
      </header>

      {foods.length === 0 ? (
        <div className="text-slate-500 italic">No food found in these locations.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((item, index) => (
            <div 
              key={index} 
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-blue-500 transition-colors shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{item.Name}</h3>
                <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800">
                  {item.Area}
                </span>
              </div>
              
              <div className="space-y-2 text-slate-400 text-sm">
                <p>📍 {item.Landmark || 'Landmark not listed'}</p>
                <p>⭐ {item.Category|| 'No Category'}</p>
              </div>

              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
