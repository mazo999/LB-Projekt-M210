import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client initialisieren
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GradesManager = ({ moduleId }) => {
  const [grades, setGrades] = useState([]); // Notenliste
  const [moduleName, setModuleName] = useState(""); // Modulname
  const [newGrade, setNewGrade] = useState(""); // Neue Note
  const [error, setError] = useState(""); // Fehlerzustand für Validierung

  // Modulname abrufen
  const fetchModuleName = async () => {
    const { data, error } = await supabase
      .from("module")
      .select("modul")
      .eq("id", moduleId)
      .single();

    if (error) {
      console.error("Error fetching module name:", error);
    } else {
      setModuleName(data.modul);
    }
  };

  // Noten abrufen
  const fetchGrades = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("grade")
      .select("id, note, created_at")
      .eq("modul", moduleId)
      .eq("user", user.id);

    if (error) {
      console.error("Error fetching grades:", error);
    } else {
      setGrades(data || []);
    }
  };

  // Neue Note hinzufügen
  const addGrade = async () => {
    if (isNaN(newGrade) || newGrade < 0 || newGrade > 6) {
      setError("Please enter a valid grade between 0 and 6.");
      return;
    }
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("grade")
      .insert([{ modul: moduleId, note: parseFloat(newGrade), user: user.id }])
      .select();

    if (error) {
      console.error("Error adding grade:", error);
    } else {
      setGrades((prev) => [...prev, ...data]);
      setNewGrade("");
    }
  };

  // Note löschen
  const deleteGrade = async (id) => {
    const { error } = await supabase.from("grade").delete().eq("id", id);

    if (error) {
      console.error("Error deleting grade:", error);
    } else {
      setGrades((prev) => prev.filter((grade) => grade.id !== id));
    }
  };

  // Note aktualisieren
  const updateGrade = async (id) => {
    const updatedNote = prompt("Enter the updated grade (0-6):");
    if (isNaN(updatedNote) || updatedNote < 0 || updatedNote > 6) {
      alert("Please enter a valid grade between 0 and 6.");
      return;
    }

    const { error } = await supabase
      .from("grade")
      .update({ note: parseFloat(updatedNote) })
      .eq("id", id);

    if (error) {
      console.error("Error updating grade:", error);
    } else {
      setGrades((prev) =>
        prev.map((grade) =>
          grade.id === id ? { ...grade, note: parseFloat(updatedNote) } : grade
        )
      );
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchModuleName();
      fetchGrades();
    }
  }, [moduleId]);

  return (
    <div>
      <h2>
        Noten Modul: <strong>{moduleName || "Unbekanntes Modul"}</strong>
      </h2>
      <ul>
        {grades.map((grade) => (
          <li key={grade.id} className="grade-item">
            {/* Noten und Datum linksbündig */}
            <span>
              {grade.note} - {new Date(grade.created_at).toLocaleString()}
            </span>

            {/* Buttons rechtsbündig */}
            <div className="grade-buttons">
              <button onClick={() => updateGrade(grade.id)}>Update</button>
              <button onClick={() => deleteGrade(grade.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Eingabe für neue Noten */}
      <input
        type="number"
        value={newGrade}
        onChange={(e) => setNewGrade(e.target.value)}
        placeholder="Add grade"
      />
      <button onClick={addGrade}>Add Grade</button>

      {/* Validierungs-Fehlermeldung anzeigen */}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default GradesManager;
