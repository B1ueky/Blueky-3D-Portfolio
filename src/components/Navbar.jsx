const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'lostfocus', label: 'Lost Focus' },
  { id: 'contact', label: 'Contact Me' },
];

const Navbar = ({ section, onNavigate }) => {
  return (
    <>
      {/* Top left logo */}
      <header className="fixed top-0 left-0 z-50">
        <div className="px-8 md:px-12 py-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="metallic-text text-3xl font-extrabold tracking-wider"
          >
            BLUEKY.
          </a>
        </div>
      </header>

      {/* Right side vertical nav */}
      <nav className="fixed right-8 md:right-12 top-6 z-50 flex flex-col items-end gap-4">
        {navItems.map((item) => {
          const isActive = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <span
                className={`text-xs md:text-sm font-mono uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'text-white/90'
                    : 'text-white/30 group-hover:text-white/70'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
