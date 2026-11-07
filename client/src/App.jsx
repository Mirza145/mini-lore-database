import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Loader } from './components/Feedback.jsx';
import HomePage from './pages/HomePage.jsx';
import CharactersPage from './pages/CharactersPage.jsx';
import CharacterDetailPage from './pages/CharacterDetailPage.jsx';
import CharacterFormPage from './pages/CharacterFormPage.jsx';
import LorePage from './pages/LorePage.jsx';
import LoreFormPage from './pages/LoreFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Cytoscape is only needed on the graph screen, so keep it out of the initial bundle.
const GraphPage = lazy(() => import('./pages/GraphPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<Loader label="Loading…" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="characters" element={<CharactersPage />} />
          <Route path="characters/new" element={<CharacterFormPage />} />
          <Route path="characters/:id" element={<CharacterDetailPage />} />
          <Route path="characters/:id/edit" element={<CharacterFormPage />} />
          <Route path="lore" element={<LorePage />} />
          <Route path="lore/new" element={<LoreFormPage />} />
          <Route path="lore/:id/edit" element={<LoreFormPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
