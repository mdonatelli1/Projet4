import axios from 'axios';
import { useEffect, useRef, useState  } from 'react';
import { Button, Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import Message from "../components/Message.jsx";

export default function App({ isAuth, setIsAuth }) {
  // msgContent contiendra le contenu du message à envoyer
  const [msgContent, setMsgContent] = useState("");
  // posts contiendra la totalité des posts
  const [posts, setPosts] = useState([]);
  // scrollToBottom
  const scrollViewRef = useRef();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const auth_token = sessionStorage.getItem("auth_token");

    axios
    .get(`http://192.168.1.27:3000/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
      }
    })
    .then((response) => setUserData(response.data))

    // On récupère la totalité des posts,
    axios
      .get("http://192.168.1.27:3000/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
        }
      })
      .then((response) => setPosts(response.data))  // et on les assigne à la state : posts
      .catch((err) => console.error(err))
  }, [])

  // scrollToBottom
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [posts])
  // --------------

  // handlePost permet de transmettre au BACK le message envoyé
  const handlePost = () => {
    const auth_token = sessionStorage.getItem("auth_token");

    // On transmet le message envoyé au BACK
    axios
      .post("http://192.168.1.27:3000/posts",
      {
        message: msgContent,  // contenu du message
        authorId: userData._id,  // id de l'auteur du message
        authorPseudo: userData.pseudo  // pseudo de l'auteur du message
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
        }
      })
      .catch((err) => console.error(err));

    // On recharge la page afin d'afficher le nouveau post
    window.location.reload();
  }

  return (
    <View style={styles.container}>
      {/* "Bouton" de déconnexion */}
      <Image
        style={styles.logout}
        onClick={() => {
          // On déconnecte l'utilisateur
          sessionStorage.setItem("isAuth", false)
          setIsAuth(false);
        }}
        source={require("../assets/images/logout.png")}
        alt="logout"
      />
      <ScrollView
        // scrollToBottom
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {/* On affiche la totalité des posts */}
        {posts.map((message) => (
          <Message key={message._id} id={message._id} post={message} userData={userData} />
        ))}
      </ScrollView>
      {/* "Formulaire" de création d'un post */}
      <View style={styles.post}>
        <TextInput
          style={styles.input}
          // composant contrôlé
          value={msgContent}
          onChange={(e) => setMsgContent(e.target.value)}
          // ------------------
        />
        <Button
          color={"#FF6C37"}
          title="Envoyer"
          onPress={() => handlePost()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: "10%",
    height: "100%",
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logout: {
    height: "32px",
    width: "32px",
    position: "absolute",
    top: 0,
    right: 0,
    cursor: "pointer"
  },
  messages: {
    flex: 1,
    width: "90%",
    marginBottom: "5%",
  },
  post: {
    width: "90%",
    marginBottom: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#1B1918",
    flex: 0.9,
    borderRadius: "10px",
    padding: "5px"
  }
});
