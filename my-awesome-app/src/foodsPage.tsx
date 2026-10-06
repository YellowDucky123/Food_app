import { useParams, useNavigate } from 'react-router-dom';
import foodsData from './data/foods.json';

type Food = {
  Name: string;
  Area: string;
  Landmark?: string;
  Category?: string;
};

const allFoods = foodsData as Food[];

export default function FoodsPage() {	
  const { locations } = useParams();
  const navigate = useNavigate();

  // Convert the URL string back into an array and filter the bundled data
  const locationArray = locations ? locations.split(',') : [];
  const foods = allFoods.filter(food => locationArray.includes(food.Area));

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

              <button 
				 onClick={() => {
					let query = item.Area + " " + item.Landmark + " " + item.Name;
					window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');	
				 }}
			  className="mt-4 w-full py-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
			  >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
