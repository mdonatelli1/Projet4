import axios from 'axios';
import { useEffect, useRef, useState  } from 'react';
import { Button, Image, ScrollView, StyleSheet, TextInput, TouchableHighlight, View } from 'react-native';

import Message from "../components/Message.jsx";

export default function Home({ isAuth, setIsAuth, auth_token, setToken }) {
  // msgContent contiendra le contenu du message à envoyer
  const [msgContent, setMsgContent] = useState("");
  // posts contiendra la totalité des posts
  const [posts, setPosts] = useState([]);
  // scrollToBottom
  const scrollViewRef = useRef();
  const [userData, setUserData] = useState({});
  const [handleEdit, setHandleEdit] = useState(false);
  const [idToModify, setIdToModify] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
  axios
    .get(`http://192.168.1.27:3000/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
      }
    })
    .then((response) => {
      setUserData(response.data);
    })
    .catch((err) => {
      console.error(err);

      // On déconnecte l'utilisateur
      setIsAuth(false);
    });
  }, []);

  useEffect(() => {
    // On récupère la totalité des posts,
    axios
    .get("http://192.168.1.27:3000/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
      }
    })
    .then((response) => {
      // et on les assigne à la state : posts
      setPosts(response.data);
    })
    .catch((err) => {
      console.error(err);

      // On déconnecte l'utilisateur
      setIsAuth(false);
    });
  }, [reload]);

  // scrollToBottom
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [posts])
  // --------------

  // handlePost permet de transmettre au BACK le message envoyé
  const handlePost = () => {
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
      .then(() => {
        setReload(!reload);
        setMsgContent("");
      })
      .catch((err) => {
        console.error(err);

        // On déconnecte l'utilisateur
        setIsAuth(false);
      });
  };

  const preEdit = (postId, postMessage) => {
    setHandleEdit(true);
    setIdToModify(postId);
    setMsgContent(postMessage);
  }

  const handlePut = () => {
      axios
      .put(`http://192.168.1.27:3000/posts/${idToModify}`, {
        message: msgContent,  // contenu du message
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
        }
      })
      .then(() => {
        setReload(!reload);

        setHandleEdit(false);
        setIdToModify("");
        setMsgContent("");
      })
      .catch((err) => {
        console.warn(err.response.data.message);

        // On déconnecte l'utilisateur
        setIsAuth(false);
      });
  };

  const handleDelete = (postId) => {
      axios
      .delete(`http://192.168.1.27:3000/posts/${postId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
        }
      })
      .then(() => {
        setReload(!reload);
      })
      .catch((err) => {
        console.warn(err.response.data.message);
        
        // On déconnecte l'utilisateur
        setIsAuth(false);
      }); 
  };

  return (
    <View style={styles.container}>
      {/* "Bouton" de déconnexion */}
      <TouchableHighlight
        style={styles.logoutContainer}
        onPress={() => {
          // On déconnecte l'utilisateur
          setIsAuth(false);
        }}
      >
        <Image
          style={styles.logout}
          source={require("../assets/images/logout.png")}
          alt="logout"
        />
      </TouchableHighlight>
      <ScrollView
        // scrollToBottom
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {/* On affiche la totalité des posts */}
        {posts.map((message) => (
          <Message key={message._id} post={message} userData={userData} handleModif={preEdit} handleDelete={handleDelete} isAuth={isAuth} setIsAuth={setIsAuth} auth_token={auth_token} />
        ))}
      </ScrollView>
      {/* "Formulaire" de création d'un post */}
      <View style={styles.post}>
        <TextInput
          style={styles.input}
          // composant contrôlé
          value={msgContent}
          onChangeText={(e) => setMsgContent(e)}
          // ------------------
        />
        {!handleEdit ? (
          <Button
            color={"#FF6C37"}
            title="Envoyer"
            onPress={() => handlePost()}
          />
        ) : (
          <Button
            color={"#FF6C37"}
            title="Enregistrer"
            onPress={() => handlePut()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
    paddingTop: "10%",
    height: "100%",
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    // cursor: "pointer"
  },
  logout: {
    height: 32,
    width: 32,
  },
  messages: {
    flex: 1,
    width: "90%",
    marginBottom: "5%",
    marginTop: "5%"
  },
  post: {
    width: "90%",
    marginBottom: "30%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#1B1918",
    flex: 0.9,
    borderRadius: 10,
    padding: 5
  }
});
