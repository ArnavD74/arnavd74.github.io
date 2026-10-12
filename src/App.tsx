import Home from './pages/Home';
import FPSCounter from './components/ui/FPSCounter';

/**
 * Single-page site: there is nothing to route.
 *
 * Unknown paths are served GitHub Pages' static `404.html` by the host before any
 * JavaScript loads, so the React catch-all route it used to carry was never
 * reachable in production — it only cost every visitor the router bundle.
 */
function App() {
  return (
    <>
      <FPSCounter />
      <Home />
    </>
  );
}

export default App;
