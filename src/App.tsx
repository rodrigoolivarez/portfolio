
import { Route, Routes } from "react-router-dom";
import "animate.css/animate.min.css"; 
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import { AboutMe } from "./pages/AboutMe/AboutMe"; 
import Contact from "./pages/Contact/Contact";
import { Projects } from './pages/Projects/Projects';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

export default function App() {
  return (
    <Layout>
    <ScrollToTop />
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="sobre-mi" element={<AboutMe />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="contacto" element={<Contact />} />
      </Routes>
    </Layout>
  );
}