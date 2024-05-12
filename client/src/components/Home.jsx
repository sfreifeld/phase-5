import { supabase } from "../supabaseClient"


function Home() {
  return (
    <div>
        <div>Logged in!</div>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}

export default Home;