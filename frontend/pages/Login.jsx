import axios from 'axios';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Login({ isAuth, setIsAuth }) {
  // errors contiendra la totalité des erreurs du formulaire
  const [errors, setErrors] = useState({});
  // Initialisation des données du formulaire
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    pseudo: "",
  })
  // login contiendra 'connect' pour se connecter ou 'register' pour s'enregistrer
  const [login, setLogin] = useState("");

  // handleConnect permet de se connecter
  const handleConnect = () => {
      axios.post("http://192.168.1.27:3000/auth/login", {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      })
      .then(() => {
        setIsAuth(true);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  // handleRegister permet de s'enregistrer
  const handleRegister = () => {
    axios
      .post("http://192.168.1.27:3000/auth/register", {
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        pseudo: formData.pseudo
      })
      .then(() => setLogin("connect"))  // Si l'enregistrement a réussi, alors on actualise la state 'login', afin d'envoyer l'utilisateur sur le formulaire de connexion
      .catch((err) => setErrors(err.response.data))
  }
  
  // handleChange permet de mettre à jour les données du formulaire qu'il soit de connexion ou d'inscription, et peu importe la valeur à actualiser
  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  return (
    <View style={styles.login}>
      {/* CHOIX DE L'AUTHENTIFICATION */}
      {!login && (
        <>
          <Button
            color={"#FF6C37"}
            title="Se connecter"
            // L'utilisateur choisit de se connecter
            onPress={() => setLogin("connect")}
          />
          <Button
            color={"#FF6C37"}
            title="S'inscrire"
            // L'utilisateur choisit de s'inscire
            onPress={() => setLogin("register")}
          />
        </>
      )}
      {/* CONNEXION */}
      {login === "connect" && (
        <>
          <Text style={styles.text}>Email</Text>
          <TextInput
            id="email"
            style={styles.input}
            value={formData.email}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  email: e,
                }))
            }}
          />
          <Text style={styles.text}>Mot de passe</Text>
          <TextInput
            id="password"
            secureTextEntry={true}
            style={styles.input}
            value={formData.password}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  password: e,
                }))
            }}
          />
          <Button
            color={"#FF6C37"}
            title="Se connecter"
            // L'utilisateur se connecte
            onPress={() => handleConnect()}
          />
          {/* L'email n'est pas dans la BDD ou le MDP est incorrecte */}
          {errors.loginError && (
            <Text style={styles.text}>{errors.loginError}</Text> 
          )}
          {/* Il y a une erreur de saisie */}
          {errors.errorMessage && errors.errorMessage.map((error) => (
            <Text key={error.message} style={styles.text}>{error.message}</Text>
          ))}
        </>
      )}
      {/* INSCRIPTION */}
      {login === "register" && (
        <>
          <Text style={styles.text}>Email</Text>
          <TextInput
            id="email"
            style={styles.input}
            value={formData.email}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  email: e,
                }))
            }}
          />
          <Text style={styles.text}>Mot de passe</Text>
          <TextInput
            id="password"
            secureTextEntry={true}
            style={styles.input}
            value={formData.password}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  password: e,
                }))
            }}
          />
          <Text style={styles.text}>Confirmer le mot de passe</Text>
          <TextInput
            id="password2"
            secureTextEntry={true}
            style={styles.input}
            value={formData.password2}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  password2: e,
                }))
            }}
          />
          <Text style={styles.text}>Pseudo</Text>
          <TextInput
            id="pseudo"
            style={styles.input}
            value={formData.pseudo}
            onChangeText={(e) => {
              setFormData((prevState) => ({
                  ...prevState,
                  pseudo: e,
                }))
            }}
          />
          <Button
            color={"#FF6C37"}
            title="S'inscrire"
            // L'utilisateur s'enregistre
            onPress={() => handleRegister()}
          />
          {/* Les mots de passe ne sont pas identiques */}
          {errors.passwordError && (
             <Text style={styles.text}>{errors.passwordError}</Text>
          )}
          {/* Il y a une erreur de saisie */}
          {errors.errorMessage && errors.errorMessage.map((error) => (
            <Text key={error.message} style={styles.text}>{error.message}</Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  login: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  text: {
    color: "#FFFFFF"
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    width: 159
  }
});
