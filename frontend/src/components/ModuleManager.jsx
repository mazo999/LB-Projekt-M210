import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [newName, setNewName] = useState("");

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

  const addModule = async () => {
    if (!newName) {
      alert("Please enter a module name");
      return;
    }

    const { data, error } = await supabase
      .from("module")
      .insert([{ modul: newName }])
      .select();

    if (error) {
      console.error("Error adding module:", error);
    } else {
      setModules((prev) => [...prev, ...data]);
      setNewName("");
      console.log("Module added successfully:", data);
    }
  };

  const updateModule = async () => {
    const { data, error } = await supabase
      .from("module")
      .update({ modul: newName })
      .eq("id", selectedModule);

    if (error) {
      console.error("Error updating module:", error);
    } else {
      console.log("Module updated:", data);
    }
  };

  const deleteModule = async () => {
    const { data, error } = await supabase
      .from("module")
      .delete()
      .eq("id", selectedModule);

    if (error) {
      console.error("Error deleting module:", error);
    } else {
      console.log("Module deleted:", data);
    }
  };

  return (
    <div>
      <h1>Module Manager</h1>
      <select
        value={selectedModule}
        onChange={(e) => setSelectedModule(e.target.value)}
      >
        <option value="">-- Select a Module --</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.id} - {module.modul}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New Module Name"
      />
      <button onClick={addModule}>Add Module</button>
      <button onClick={updateModule}>Update Module</button>
      <button onClick={deleteModule}>Delete Module</button>
    </div>
  );
};

export default ModuleManager;
