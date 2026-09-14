import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import Layout from './Layout';
import Home from '@/features/home/Home';
import { useLocale } from '@/lib/locale';

// Keep the first Home payload deliberately small. Every secondary route is a
// lazy boundary so governed corpora and route-specific UI do not inflate the
// initial application chunk.
const ArupadaiVeedu = lazy(() => import('@/features/temples/ArupadaiVeedu'));
const Temples = lazy(() => import('@/features/temples/Temples'));
const TempleExperience = lazy(() => import('@/features/library/TempleExperience'));
const Thiruppugazh = lazy(() => import('@/features/thiruppugazh/Thiruppugazh'));
const SongExperience = lazy(() => import('@/features/library/SongExperience'));
const Works = lazy(() => import('@/features/works/Works'));
const Prayers = lazy(() => import('@/features/prayers/Prayers'));
const Practice = lazy(() => import('@/features/practice/Practice'));
const Search = lazy(() => import('@/features/search/Search'));
const Knowledge = lazy(() => import('@/features/knowledge/Knowledge'));
const Library = lazy(() => import('@/features/library/Library'));
const Completeness = lazy(() => import('@/features/trust/Completeness'));
const Sources = lazy(() => import('@/features/trust/Sources'));
const NotFound = lazy(() => import('@/features/trust/NotFound'));

// Legal/public-information pages are valid direct routes but are rarely part
// of a first Home visit. Keep the shared Doc implementation in one module and
// lazy-load each named export so Legal.tsx stays out of the eager Home chunk.
const About = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.About })));
const Privacy = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.Privacy })));
const Terms = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.Terms })));
const Disclaimer = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.Disclaimer })));
const Accessibility = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.Accessibility })));
const Contact = lazy(() => import('@/features/legal/Legal').then((module) => ({ default: module.Contact })));

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
