import { useState, useEffect } from "react";
import "./App.css";
import ModuleDropdown from "./components/ModuleDropdown.jsx";
import ModuleManager from "./components/ModuleManager.jsx";
import GradesManager from "./components/GradesManager.jsx";

import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

// Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null); // Benutzer-Session
  const [selectedModule, setSelectedModule] = useState(null); // Ausgewähltes Modul

  // Auth-Session beim Laden der App wiederherstellen
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    // Auth-Status-Listener
    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Logout-Funktion
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error);
    else setSession(null);
  };

  if (!session) {
    // Benutzer ist nicht eingeloggt
    return (
      <div className="container">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    );
  }

  const email = session?.user?.email; // E-Mail-Adresse des Benutzers
  const userName = email.split("@")[0]; // Nur der Name vor @

  return (
    <div className="container">
      <div className="flex-header">
        <h1>Welcome {email === "admin@admin.com" ? "Admin" : userName}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Benutzer-Bereich */}
      {email !== "admin@admin.com" && (
        <div className="module-box">
          <ModuleDropdown
            onSelectModule={(moduleId) => setSelectedModule(moduleId)}
          />
          {selectedModule && <GradesManager moduleId={selectedModule} />}
        </div>
      )}

      {/* Admin-Bereich */}
      {email === "admin@admin.com" && (
        <div className="module-box">
          <ModuleManager />
        </div>
      )}
    </div>
  );
}

export default App;
