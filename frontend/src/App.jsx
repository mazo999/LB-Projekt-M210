import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ModuleDropdown from "./components/ModuleDropdown.jsx";
import ModuleManager from "./components/ModuleManager.jsx";

import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
// Supabase-URL und API-Key aus den Umgebungsvariablen laden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY; // Vite-spezifisch
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);

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
        {" "}
        <div>Logged in as{email === "xum879@gmail.com" && " Admin"}</div>
        <>
          {email !== "xum879@gmail.com" && <ModuleDropdown />}
          <ModuleManager />
        </>
      </>
    );
  }
}

export default App;
