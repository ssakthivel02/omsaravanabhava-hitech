import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import Layout from './Layout';
import Home from '@/features/home/Home';
import ArupadaiVeedu from '@/features/temples/ArupadaiVeedu';
import { useLocale } from '@/lib/locale';

// The temple corpus is the largest content chunk. Split it out so it is
// fetched only when a temple/search route is actually visited.
const Temples = lazy(() => import('@/features/temples/Temples'));
const TempleExperience = lazy(() => import('@/features/library/TempleExperience'));
const SongExperience = lazy(() => import('@/features/library/SongExperience'));
const Search = lazy(() => import('@/features/search/Search'));
const Knowledge = lazy(() => import('@/features/knowledge/Knowledge'));
const Library = lazy(() => import('@/features/library/Library'));
import Thiruppugazh from '@/features/thiruppugazh/Thiruppugazh';
import Works from '@/features/works/Works';
import Prayers from '@/features/prayers/Prayers';
import Practice from '@/features/practice/Practice';
import Completeness from '@/features/trust/Completeness';
import Sources from '@/features/trust/Sources';
import NotFound from '@/features/trust/NotFound';
import {
  About,
  Privacy,
  Terms,
  Disclaimer,
  Accessibility,
  Contact,
} from '@/features/legal/Legal';

export default function App() {
  const { locale, text } = useLocale();

  return (
    <Layout>
      <Suspense
        fallback={
          <p className="page" role="status" lang={locale}>
            {text('ஏற்றப்படுகிறது…', 'Loading…')}
          </p>
        }
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/library" component={Library} />
          <Route path="/arupadai-veedu" component={ArupadaiVeedu} />
          <Route path="/temples" component={Temples} />
          <Route path="/temples/:id" component={TempleExperience} />
          <Route path="/thiruppugazh" component={Thiruppugazh} />
          <Route path="/thiruppugazh/:id" component={SongExperience} />
          <Route path="/works" component={Works} />
          <Route path="/prayers" component={Prayers} />
          <Route path="/practice" component={Practice} />
          <Route path="/search" component={Search} />
          <Route path="/sources" component={Sources} />
          <Route path="/content-completeness" component={Completeness} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}
