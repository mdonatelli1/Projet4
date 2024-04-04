import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Message({ id, post, userData }) {
  // const [deleted, setDeleted] = useState(false);
  // fav = true si le post est liké, sinon, fav = false
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const auth_token = sessionStorage.getItem("auth_token");
    try {

      // On récupère le post
      axios
      .get(`http://192.168.1.27:3000/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
        }
      })
      .then((response) => {
        // Si le pseudo de l'utilisateur est présent dans le tableau des likers du post,
        if (response.data.likers.includes(userData._id)) {
          // alors on assigne 'true' à la state : fav
          setFav(true);
        }
      })
    } catch (err) {
      console.error(err);
    }
  }, [])

  // const handleDelete = async (id) => {
  //   try {
  //     axios
  //       .delete(`http://192.168.1.27:3000/post/${id}`)
  //       .catch((err) => console.error(err))
  //     setDeleted(true);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // handleFav permet de liker ou de disliker le post en fonction de la valeur de la state : fav
  const handleFav = async (id) => {
    const auth_token = sessionStorage.getItem("auth_token");
    try {
      if (fav) {
        // Si le post est liké,
        axios
        .patch(`http://192.168.1.27:3000/posts/dislike-post/${id}`, { // alors on le dislike,
          userId: userData._id
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
          }
        })
      } else {
        // sinon,
        axios
        .patch(`http://192.168.1.27:3000/posts/like-post/${id}`, {  // on le like
          userId: userData._id
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
          }
        })
      }
    } catch (err) {
      console.error(err);
    }

    // On met à jour la state : fav
    setFav(!fav);
  }

  return (
    <View style={styles.message}>
      <Text style={styles.author}>{post.authorPseudo}</Text>
      <View style={styles.messageContent}>
        <Text>{post.message}</Text>
        {fav ? (
          // Si le post est liké, alors on affiche le coeur plein,
          <Image
            style={styles.fav}
            onClick={() => handleFav(id)}
            source={require("../assets/images/heart-solid.png")}
            alt="yesFav"
          />
        ) : (
          // sinon on affiche le coeur vide
          <Image
            style={styles.fav}
            onClick={() => handleFav(id)}
            source={require("../assets/images/heart-regular.png")}
            alt="noFav"
          />
        )}
      </View>
      <Text style={styles.datetime}>{post.createdAt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginTop: "5px",
    marginBottom: "5px",
    position: "relative",
    width: "90%",
  },
  toRight: {
    alignSelf: "flex-end"
  },
  author: {
    fontSize: "0.75rem",
    color: "#FF6C37"
  },
  messageContent: {
    backgroundColor: "#FFFFFF",
    border: "solid 1px #FF6C37",
    borderRadius: "10px",
    marginTop: "2.5px",
    marginBottom: "2.5px",
    padding: "10px"
  },
  fav: {
    height: "16px",
    width: "16px",
    position: "absolute",
    right: 0,
    bottom: 0,
    transform: "translate(50%, 50%)"
  },
  datetime: {
    fontSize: "0.5rem",
    color: "#FF6C37"
  }
});
