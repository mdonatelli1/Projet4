import { useContext } from "react";

import { AuthContext } from "./contexts/AuthProvider.jsx";

import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"

function Router() {
  const {isAuth} =  useContext(AuthContext);

  return (
    <>
      {isAuth ? (
        // Si l'utilisateur est authentifié, alors on lui donne l'accès à sa session,
        <Home />
      ) : (
        // sinon on lui propose de s'authentifier : connexion ou inscription
        <Login />
      )}
    </>
  );
};

export default Router;
