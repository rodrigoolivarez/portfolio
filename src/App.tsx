import { Route, Routes } from "react-router-dom";
import AboutMe from "./pages/AboutMe/AboutMe";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout"; // Asegúrate que Layout no ponga su propio fondo conflictivo
import Projects from "./pages/Projects/Projects";
import Contact from "./pages/Contact/Contact";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sobre-mi" element={<AboutMe />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="contacto" element={<Contact/>}/>
      </Route>
    </Routes>
  )
}