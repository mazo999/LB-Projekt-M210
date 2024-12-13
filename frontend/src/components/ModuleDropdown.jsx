import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-URL und API-Key aus den Umgebungsvariablen laden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // Vite-spezifisch
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleDropdown = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  //Daten aus Tabelle abrufen
  const fetchModules = async () => {
    const { data, error } = await supabase.from("module").select("modul");
    if (error) {
      console.error("Error fetching modules", error);
    } else {
      setModules(data);
    }
  };

  //Daten beim Laden der Seite abrufen
  useEffect(() => {
    fetchModules();
  }, []);
  return (
    <div>
      <label htmlFor="module-dropdown">Select Module:</label>
      <select
        id="module-dropdown"
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
      >
        <option value="">Bitte wähle ein Modul aus</option>
        {modules.map((module, index) => (
          <option key={index} value={module.modul}>
            {module.modul}
          </option>
        ))}
      </select>
      <p>Ausgewähltes Modul: {selectedModule}</p>
    </div>
  );
};

export default ModuleDropdown;
