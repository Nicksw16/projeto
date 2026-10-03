import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { SiteLayout } from "@/components/layout/site-layout";
import HomePage from "@/pages/home";

const ServicosPage = lazy(() => import("@/pages/servicos"));
const AutomacaoPage = lazy(() => import("@/pages/automacao"));
const ProcessoPage = lazy(() => import("@/pages/processo"));
const PlanosPage = lazy(() => import("@/pages/planos"));
const FaqPage = lazy(() => import("@/pages/faq"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="servicos" element={<ServicosPage />} />
            <Route path="automacao" element={<AutomacaoPage />} />
            <Route path="processo" element={<ProcessoPage />} />
            <Route path="planos" element={<PlanosPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
