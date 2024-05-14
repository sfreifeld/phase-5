import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";


function Home( { session }) {
    console.log(session)
  return (
    <div>
        <NavBarMain session={session}></NavBarMain>
        <div>Logged in!</div>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}

export default Home;