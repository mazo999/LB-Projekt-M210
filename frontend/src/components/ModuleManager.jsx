import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-URL und API-Key aus den Umgebungsvariablen laden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // Vite-spezifisch
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [newName, setNewName] = useState("");

  // Module aus der Datenbank abrufen
  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase.from("module").select("modul");
      if (error) {
        console.error("Error fetching modules:", error);
      } else {
        setModules(data);
      }
    };

    fetchModules();
  }, []);

  // Modul aktualisieren (PUT)
  const updateModule = async () => {
    const { data, error } = await supabase
      .from("module")
      .update({ modul: newName })
      .eq("modul", selectedModule); // Vergleich mit dem Modulnamen

    if (error) {
      console.error("Error updating module:", error);
    } else {
      console.log("Module updated:", data);
    }
  };

  // Modul löschen (DELETE)
  const deleteModule = async () => {
    const { data, error } = await supabase
      .from("module")
      .delete()
      .eq("modul", selectedModule); // Vergleich mit dem Modulnamen

    if (error) {
      console.error("Error deleting module:", error);
    } else {
      console.log("Module deleted:", data);
    }
  };

  return (
    <div>
      <h1>Module Manager</h1>
      <label htmlFor="module-dropdown">Select Module:</label>
      <select
        id="module-dropdown"
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
      >
        <option value="">-- Select a Module --</option>
        {modules.map((module, index) => (
          <option key={index} value={module.modul}>
            {module.modul}
          </option>
        ))}
      </select>

      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Module Name"
        />
        <button onClick={updateModule}>Update Module</button>
        <button onClick={deleteModule}>Delete Module</button>
      </div>
    </div>
  );
};

export default ModuleManager;
