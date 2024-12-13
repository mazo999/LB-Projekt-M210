import { useState, useEffect } from "react";
import "./App.css";
import ModuleDropdown from "./components/ModuleDropdown.jsx";
import ModuleManager from "./components/ModuleManager.jsx";
import GradesManager from "./components/GradesManager.jsx";

import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    const email = session?.user?.email;

    return (
      <>
        <div>Logged in as {email === "admin@admin.com" ? "Admin" : "User"}</div>
        {email !== "admin@admin.com" && (
          <>
            <ModuleDropdown
              onSelectModule={(moduleId) => setSelectedModule(moduleId)}
            />
            {selectedModule && <GradesManager moduleId={selectedModule} />}
          </>
        )}
        {email === "admin@admin.com" && <ModuleManager />}
      </>
    );
  }
}

export default App;
