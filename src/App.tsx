import { Hero } from '@/sections/Hero';
import { SpotifyCard } from '@/sections/SpotifyCard';
import { FeaturedProject } from '@/sections/FeaturedProject';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { Footer } from '@/sections/Footer';
import './App.css';

function App() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Hero />
      <SpotifyCard />
      <FeaturedProject />
      <Stats />
      <About />
      <Footer />
    </main>
  );
}

export default App;
