import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleDropdown = ({ onSelectModule }) => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase.from("module").select("id, modul");
      if (error) {
        console.error("Error fetching modules:", error);
      } else {
        setModules(data);
      }
    };

    fetchModules();
  }, []);

  return (
    <select onChange={(e) => onSelectModule(e.target.value)}>
      <option value="">Select a Module</option>
      {modules.map((module) => (
        <option key={module.id} value={module.id}>
          {module.modul}
        </option>
      ))}
    </select>
  );
};

export default ModuleDropdown;
