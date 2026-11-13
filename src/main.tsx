import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { ProgressProvider } from './lib/store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { WorldPage } from './pages/WorldPage';
import { LessonPage } from './pages/LessonPage';
import { ProgressPage } from './pages/ProgressPage';
import { BadgesPage } from './pages/BadgesPage';
import { ExamPage } from './pages/ExamPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFound } from './pages/NotFound';

// HashRouter works on any static host (GitHub Pages, Netlify, S3) without server rewrites.
createRoot(document.getElementById('root')!).render(
  <ProgressProvider>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="world/:worldId" element={<WorldPage />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="exam" element={<ExamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </ProgressProvider>,
);
