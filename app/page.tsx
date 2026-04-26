import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="py-8">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold font-serif">DishList</div>
          <nav className="hidden md:flex gap-8 items-center font-semibold">
            <Link href="/app" className="text-[#E89B00]">Go to App</Link>
            <a href="#search" className="hover:text-[#E89B00]">Search</a>
            <a href="#log" className="hover:text-[#E89B00]">Quick Log</a>
            <a href="#waitlist" className="btn-primary">Join Waitlist</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="bg-[#4A5D23] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Beta Launch Q3 2026</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                Stop searching for <span className="italic">restaurants</span>. Find the exact <span className="text-[#E89B00]">dish</span> you crave.
              </h1>
              <p className="text-lg opacity-80 max-w-lg">
                DishList indexes specific plates, not just places. Build a searchable Taste Passport of your favorite memories and discover new gems with Google-powered insights.
              </p>
              <div className="flex gap-4">
                <Link href="/app" className="btn-primary text-lg px-10 py-4">Launch App</Link>
                <a href="#waitlist" className="btn-outline text-lg px-10 py-4">Join Waitlist</a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-3 rounded-[40px] shadow-2xl rotate-2 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" 
                  alt="DishList App Preview" 
                  className="rounded-[32px] w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4">The Plate-First Revolution</h2>
              <p className="opacity-70">We shift the unit of value from the restaurant to the individual plate, ensuring every craving is met with precision.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-[#E89B00] mb-4 text-3xl font-bold">01</div>
                <h3 className="text-xl font-bold mb-2">The Personal Vault</h3>
                <p className="text-sm opacity-70">Automatically log dishes from your photos. No more scrolling through camera rolls to find that one sandwich.</p>
              </div>
              <div className="card">
                <div className="text-[#E89B00] mb-4 text-3xl font-bold">02</div>
                <h3 className="text-xl font-bold mb-2">Sentiment Layering</h3>
                <p className="text-sm opacity-70">We overlay Google and Yelp review highlights onto your personal memories to verify every bite.</p>
              </div>
              <div className="card">
                <div className="text-[#E89B00] mb-4 text-3xl font-bold">03</div>
                <h3 className="text-xl font-bold mb-2">The Memory Shield</h3>
                <p className="text-sm opacity-70">Mark dishes as "Never Again" and get alerted if you step back into a venue where you had a bad plate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="bg-[#2D2926] text-white py-24">
          <div className="container mx-auto px-6 text-center max-w-xl">
            <h2 className="text-4xl font-serif font-bold mb-6">Join the Taste Passport</h2>
            <p className="opacity-80 mb-10">We are capping the private beta at 500 users for the Q3 2026 launch in NYC and LA.</p>
            
            <form className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl text-[#2D2926]" required />
              <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl text-[#2D2926]" required />
              <select className="w-full p-4 rounded-xl text-[#2D2926]" required>
                <option value="" disabled selected>Select Your City</option>
                <option value="NYC">New York City</option>
                <option value="LA">Los Angeles</option>
                <option value="SF">San Francisco</option>
              </select>
              <button type="submit" className="btn-primary w-full py-4 text-lg">Claim Early Access</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex justify-between items-center opacity-60">
          <div className="font-serif font-bold text-xl">DishList</div>
          <div>&copy; 2026 DishList. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
