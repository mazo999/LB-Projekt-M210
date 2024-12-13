import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const GradesManager = ({ moduleId }) => {
  const [grades, setGrades] = useState([]);
  const [newGrade, setNewGrade] = useState("");

  // Noten für das Modul abrufen
  const fetchGrades = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) throw new Error("User not authenticated");

      console.log("Fetching grades for module:", moduleId, "user:", user.id);

      const { data, error } = await supabase
        .from("grade")
        .select("id, note, created_at")
        .eq("modul", moduleId)
        .eq("user", user.id);

      if (error) {
        console.error("Error fetching grades:", error);
        setGrades([]); // Setze den Zustand auf eine leere Liste bei Fehlern
      } else {
        console.log("Fetched grades:", data);
        setGrades(data || []);
      }
    } catch (error) {
      console.error("Error fetching grades:", error.message);
    }
  };

  // Neue Note hinzufügen
  const addGrade = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) throw new Error("User not authenticated");

      if (isNaN(newGrade) || newGrade < 0 || newGrade > 6) {
        alert("Please enter a valid grade between 0 and 6.");
        return;
      }

      console.log("Adding grade:", {
        modul: moduleId,
        note: parseFloat(newGrade),
        user: user.id,
      });

      const { data, error } = await supabase
        .from("grade")
        .insert([
          { modul: moduleId, note: parseFloat(newGrade), user: user.id },
        ])
        .select();

      if (error) {
        console.error("Error adding grade:", error);
      } else {
        console.log("Grade added successfully:", data);
        setGrades((prev) => [...prev, ...data]);
        setNewGrade("");
      }
    } catch (error) {
      console.error("Error adding grade:", error.message);
    }
  };

  useEffect(() => {
    if (moduleId) {
      console.log("Module ID updated, fetching grades...");
      fetchGrades(); // Abrufen der Noten, wenn `moduleId` aktualisiert wird
    }
  }, [moduleId]); // Effekt wird ausgeführt, wenn sich `moduleId` ändert

  return (
    <div>
      <h2>Grades for Module {moduleId}</h2>
      <ul>
        {grades.map((grade) => (
          <li key={grade.id}>
            {grade.note} - {new Date(grade.created_at).toLocaleString()}
            <button
              onClick={() =>
                updateGrade(grade.id, prompt("Update grade:", grade.note))
              }
            >
              Edit
            </button>
            <button onClick={() => deleteGrade(grade.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="number"
        value={newGrade}
        onChange={(e) => setNewGrade(e.target.value)}
        placeholder="Add grade"
      />
      <button onClick={addGrade}>Add Grade</button>
    </div>
  );
};

export default GradesManager;
