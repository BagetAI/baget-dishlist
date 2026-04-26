"use client";

import { useState, useEffect } from "react";
import { Search, Plus, MapPin, Star, Clock, Image as ImageIcon, ChevronRight, X } from "lucide-react";

const DISHES_DB_ID = '2c498536-0482-4e57-ac8b-4e7b5cea3042';

export default function AppDashboard() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    place_id: "",
    dish_name: "",
    memory_notes: "",
    rating: 5,
    image_url: ""
  });

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dishes/search?q=${search}`);
      const result = await res.json();
      if (result.success) {
        setDishes(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch dishes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDishes();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleLogDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dishes/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDish),
      });
      const result = await res.json();
      if (result.success) {
        setIsLogOpen(false);
        setNewDish({ place_id: "", dish_name: "", memory_notes: "", rating: 5, image_url: "" });
        fetchDishes();
      }
    } catch (err) {
      alert("Error logging dish");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F9F7F2] shadow-xl flex flex-col relative overflow-hidden">
      {/* App Header */}
      <header className="p-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2D2926]">Taste Passport</h1>
          <p className="text-xs font-semibold text-[#4A5D23] uppercase tracking-wider">NYC / LA Beta</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#E89B00] flex items-center justify-center text-white font-bold">
          EJ
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search your memories (e.g. Pesto)" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E89B00]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Dish List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Your Vault</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E89B00]"></div>
              <p className="text-sm opacity-50">Syncing with Taste Vault...</p>
            </div>
          ) : dishes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 mb-4">No culinary memories found.</p>
              <button 
                onClick={() => setIsLogOpen(true)}
                className="text-[#E89B00] font-bold"
              >
                Log your first dish
              </button>
            </div>
          ) : (
            dishes.map((dish: any, idx: number) => (
              <div key={idx} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 group">
                <div className="relative aspect-[4/3]">
                  <img 
                    src={dish.photo_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"} 
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#4A5D23] border border-[#4A5D23]/20">
                    98% Positive Sentiment
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-serif font-bold">{dish.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dish.venue_id}
                      </p>
                    </div>
                    <div className="flex gap-0.5 text-[#E89B00]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < dish.rating ? 'fill-[#E89B00]' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  {dish.user_notes && (
                    <p className="text-sm italic text-gray-600 border-l-2 border-[#E89B00] pl-3 py-1 mt-2">
                      "{dish.user_notes}"
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsLogOpen(true)}
        className="fixed bottom-24 right-1/2 translate-x-1/2 md:right-10 md:translate-x-0 w-16 h-16 bg-[#E89B00] rounded-full shadow-2xl flex items-center justify-center text-white transition-transform active:scale-90 z-20"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-6 z-10">
        <button className="flex flex-col items-center gap-1 text-[#2D2926]">
          <Clock className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#E89B00]">
          <Star className="w-6 h-6 fill-[#E89B00]" />
          <span className="text-[10px] font-bold uppercase">Passport</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <ImageIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Vault</span>
        </button>
      </nav>

      {/* Log Drawer / Modal */}
      {isLogOpen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-end">
          <div className="bg-white w-full rounded-t-[32px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">New Culinary Memory</h2>
              <button onClick={() => setIsLogOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleLogDish} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">What did you eat?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Penne Pesto" 
                  className="w-full p-4 rounded-xl bg-gray-50 border-none"
                  value={newDish.dish_name}
                  onChange={(e) => setNewDish({...newDish, dish_name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Where at?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cecconi's West Hollywood" 
                  className="w-full p-4 rounded-xl bg-gray-50 border-none"
                  value={newDish.place_id}
                  onChange={(e) => setNewDish({...newDish, place_id: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Memory Notes</label>
                <textarea 
                  placeholder="A bit too salty but great texture..." 
                  className="w-full p-4 rounded-xl bg-gray-50 border-none h-24 resize-none"
                  value={newDish.memory_notes}
                  onChange={(e) => setNewDish({...newDish, memory_notes: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Rating</label>
                  <select 
                    className="w-full p-4 rounded-xl bg-gray-50 border-none appearance-none"
                    value={newDish.rating}
                    onChange={(e) => setNewDish({...newDish, rating: Number(e.target.value)})}
                  >
                    <option value="5">Loved it (5)</option>
                    <option value="4">Great (4)</option>
                    <option value="3">Okay (3)</option>
                    <option value="2">Meh (2)</option>
                    <option value="1">Never Again (1)</option>
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Photo URL</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    className="w-full p-4 rounded-xl bg-gray-50 border-none"
                    value={newDish.image_url}
                    onChange={(e) => setNewDish({...newDish, image_url: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-5 text-lg mt-4 shadow-xl shadow-[#E89B00]/20">
                Record in Passport
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
