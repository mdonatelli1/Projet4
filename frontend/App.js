import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"

export default function App() {
  // Initialisation de l'authentification
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState("");

  // useEffect(() => {
  //   if (sessionStorage.getItem("isAuth") !== null) {
  //     // Si la valeur de l'authentification est dans le stockage de session, alors on lui attribue sa valeur,
  //     setIsAuth(JSON.parse(sessionStorage.getItem("isAuth")));
  //   } else {
  //     // sinon on ajoute la valeur par défaut 'false' dans le stockage de session
  //     sessionStorage.setItem("isAuth", false);
  //   }
  // }, [])

  return (
    <View style={styles.main}>
      {isAuth ? (
        // Si l'utilisateur est authentifié, alors on lui donne l'accès à sa session,
        <Home isAuth={isAuth} setIsAuth={setIsAuth} auth_token={token} setToken={setToken} />
      ) : (
        // sinon on lui propose de s'authentifier : connexion ou inscription
        <Login isAuth={isAuth} setIsAuth={setIsAuth} auth_token={token} setToken={setToken} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: "5%",
    height: "100vh",
    width: "100%",
    backgroundColor: "#1B1918",
    display: "flex",
    alignItems: "center"
  }
});
