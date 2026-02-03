# Blueky 3D Portfolio

An interactive 3D portfolio website built with React and Three.js, featuring a rotating space station as the centerpiece.

## Features

- **3D Space Station** — Interactive GLTF model with metallic materials, custom blue/purple tinting, and emissive lighting
- **Glowing Particles** — 300 animated particles with custom GLSL shaders and additive blending
- **Post-Processing** — Bloom, chromatic aberration, and vignette effects for a cinematic sci-fi look
- **Smooth Camera Transitions** — Lerp-based camera animations between sections (Home, Lost Focus, Contact)
- **Lost Focus Mode** — Camera zooms out with backdrop blur for a dreamy, ambient view
- **Contact Form** — "Send Me a Message" form with email delivery via FormSubmit
- **Responsive Navigation** — Vertical navbar with active dot indicators

## Tech Stack

- **React 19** + **Vite** (Rolldown)
- **Three.js** / **React Three Fiber** / **Drei**
- **React Three Postprocessing**
- **Tailwind CSS v4**
- **FormSubmit** for contact form emails

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── SpaceStation.jsx    # 3D space station model
│   ├── ContactForm.jsx     # Contact form with email
│   ├── Navbar.jsx          # Navigation with dot indicators
│   └── Loader.jsx          # Loading screen
├── App.jsx                 # Main app with Canvas, camera, effects
├── index.css               # Global styles, metallic/glow text
└── main.jsx                # Entry point
public/
└── space_station_3/        # GLTF model assets
```

## Credits

- Space Station 3D model by [re1monsen](https://sketchfab.com/re1monsen) — [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/)

## License

MIT
