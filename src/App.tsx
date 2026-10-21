import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import AnalyticsTracker from "./components/Analytics/AnalyticsTracker";

// Las páginas secundarias se cargan bajo demanda: el primer render (Home) pesa menos
// y reCAPTCHA / EmailJS sólo se descargan al entrar a Contacto.
const AboutMe = lazy(() => import("./pages/AboutMe/AboutMe").then((m) => ({ default: m.AboutMe })));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const Contact = lazy(() => import("./pages/Contact/Contact"));

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <AnalyticsTracker />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="sobre-mi" element={<AboutMe />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
