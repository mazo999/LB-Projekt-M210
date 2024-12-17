import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client initialisieren
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [newModuleName, setNewModuleName] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase.from("module").select("id, modul");
      if (error) {
        console.error("Error fetching modules:", error);
      } else {
        setModules(data);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const updateModule = async () => {
    if (!selectedModuleId || !newModuleName) {
      alert("Please select a module and enter a new name");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("module")
        .update({ modul: newModuleName })
        .eq("id", selectedModuleId)
        .select();
      if (error) {
        console.error("Error updating module:", error);
      } else {
        // Update the modules list with the new data
        setModules((prev) =>
          prev.map((module) =>
            module.id === selectedModuleId
              ? { ...module, modul: newModuleName }
              : module
          )
        );
        setSelectedModuleId("");
        setNewModuleName("");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const deleteModule = async (moduleId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this module? This action cannot be undone."
      )
    ) {
      try {
        const { data, error } = await supabase
          .from("module")
          .delete()
          .eq("id", moduleId);
        if (error) {
          console.error("Error deleting module:", error);
        } else {
          setModules((prev) => prev.filter((module) => module.id !== moduleId));
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const addModule = async () => {
    if (!newModuleName) {
      alert("Please enter a module name");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("module")
        .insert([{ modul: newModuleName }])
        .select();
      if (error) {
        console.error("Error adding module:", error);
      } else {
        setModules((prev) => [...prev, ...data]);
        setNewModuleName("");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div>
      <h1>Module Manager</h1>
      <div className="input-container">
        <select
          value={selectedModuleId}
          onChange={(e) => setSelectedModuleId(e.target.value)}
        >
          <option value="">Select a module to update</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.modul}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="New Module Name"
        />
      </div>
      <button onClick={updateModule}>Update Module</button>
      <button onClick={addModule}>Add Module</button>
      <ul>
        {modules.map((module) => (
          <li key={module.id} className="module-item">
            <span>{module.modul}</span> {/* Eintrag linksbündig */}
            <button onClick={() => deleteModule(module.id)}>Delete</button>{" "}
            {/* Button rechtsbündig */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleManager;
