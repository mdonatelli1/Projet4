import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { AuthContext } from '../contexts/AuthProvider.jsx';

export default function Message({ post, userData, handleModif, handleDelete }) {
  const {setIsAuth} = useContext(AuthContext);
  // const [deleted, setDeleted] = useState(false);
  // fav = true si le post est liké, sinon, fav = false
  const [fav, setFav] = useState(false);
  const [amountLikes, setAmountLikes] = useState(post.likers.length);

  useEffect(() => {
    // Si le pseudo de l'utilisateur est présent dans le tableau des likers du post,
    if (post.likers.includes(userData._id)) {
      // alors on assigne 'true' à la state : fav
      setFav(true);
    }
  }, [])

  // handleFav permet de liker ou de disliker le post en fonction de la valeur de la state : fav
  const handleFav = () => {
    if (fav) {
      // Si le post est liké,
      axios
      .patch(`http://192.168.1.27:3000/posts/dislike-post/${post._id}`, {
        withCredentials: true,
      }).then(() => {
        setAmountLikes(amountLikes - 1);
      }).catch((err) => {
        console.error(err);

        // On déconnecte l'utilisateur
        setIsAuth(false);
      })
    } else {
      // sinon,
      axios
      .patch(`http://192.168.1.27:3000/posts/like-post/${post._id}`, {
        withCredentials: true,
      }).then(() => {
        setAmountLikes(amountLikes + 1);
      }).catch((err) => {
        console.error(err);

        // On déconnecte l'utilisateur
        setIsAuth(false);
      })
    }

    // On met à jour la state : fav
    setFav(!fav);
  }

  const changeDateFormat = (badDateFormat) => {
    const newDateFormat = new Date(badDateFormat);

    const jour = newDateFormat.getDay().toString().padStart(2, "0");
    const mois = (newDateFormat.getMonth() + 1).toString().padStart(2, "0");
    const année = newDateFormat.getFullYear();
    const heure = newDateFormat.getHours();
    const minute = newDateFormat.getMinutes();
    const seconde = newDateFormat.getSeconds();

    return `${jour}/${mois}/${année} ${heure}:${minute}:${seconde}`;
  }

  return (
    <View style={styles.message}>
      <View style={styles.messageHeader}>
        <Text style={styles.author}>{post.authorPseudo}</Text>
        {userData._id === post.authorId && (
          <>
            <TouchableHighlight
              style={styles.logoContainer}
              onPress={() => handleModif(post._id, post.message)}
            >
              <Image
                style={styles.logo}
                source={require("../assets/images/Modif.png")}
                alt="Modif"
              />
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.logoContainer}
              onPress={() => handleDelete(post._id)}
            >
              <Image
                style={styles.logo}
                source={require("../assets/images/Delete.png")}
                alt="Delete"
              />
            </TouchableHighlight>
          </>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text>{post.message}</Text>
        <Text style={styles.likers}>{amountLikes}</Text>
        {fav ? (
          // Si le post est liké, alors on affiche le coeur plein,
          <TouchableHighlight
            style={styles.favContainer}
            onPress={() => handleFav()}
          >
            <Image
              style={styles.fav}
              source={require("../assets/images/heart-solid.png")}
              alt="yesFav"
            />
          </TouchableHighlight>
        ) : (
          // sinon on affiche le coeur vide
          <TouchableHighlight
          style={styles.favContainer}
            onPress={() => handleFav()}
          >
            <Image
              style={styles.fav}
              source={require("../assets/images/heart-regular.png")}
              alt="noFav"
            />
          </TouchableHighlight>
        )}
      </View>
      <Text style={styles.datetime}>{changeDateFormat(post.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginTop: 8,
    marginBottom: 8,
    position: "relative",
    width: "90%",
  },
  toRight: {
    alignSelf: "flex-end"
  },
  messageHeader: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    color: "#FF6C37"
  },
  logoContainer: {
    // cursor: "pointer"
  },
  logo: {
    height: 16,
    width: 16,
  },
  messageContent: {
    backgroundColor: "#FFFFFF",
    border: "solid 1px #FF6C37",
    borderRadius: 10,
    marginTop: 2.5,
    marginBottom: 2.5,
    padding: 10
  },
  likers: {
    color: "#FF6C37",
    position: "absolute",
    right: 32,
    bottom: 0,
    transform: [{ translateX: 16 }, { translateY: 16 }]
  },
  favContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    transform: [{ translateX: 8 }, { translateY: 8 }]
  },
  fav: {
    height: 16,
    width: 16,
  },
  datetime: {
    fontSize: 8,
    color: "#FF6C37"
  }
});
