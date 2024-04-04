import axios from 'axios';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Message({ post, userData, handleModif, handleDelete }) {
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
  const handleFav = async () => {
    const auth_token = sessionStorage.getItem("auth_token");

    try {
      if (fav) {
        // Si le post est liké,
        axios
        .patch(`http://192.168.1.27:3000/posts/dislike-post/${post._id}`, { // alors on le dislike,
          userId: userData._id
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
          }
        })

        setAmountLikes(amountLikes - 1);
      } else {
        // sinon,
        axios
        .patch(`http://192.168.1.27:3000/posts/like-post/${post._id}`, {  // on le like
          userId: userData._id
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`, // Inclusion du jeton JWT
          }
        })

        setAmountLikes(amountLikes + 1);
      }
    } catch (err) {
      console.error(err);

      // On déconnecte l'utilisateur
      sessionStorage.setItem("isAuth", false);
      setIsAuth(false);
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
            <Image
              style={styles.logo}
              onClick={() => handleModif(post._id, post.message)}
              source={require("../assets/images/Modif.png")}
              alt="Modif"
            />
            <Image
              style={styles.logo}
              onClick={() => handleDelete(post._id)}
              source={require("../assets/images/Delete.png")}
              alt="Delete"
            />
          </>
        )}
      </View>
      <View style={styles.messageContent}>
        <Text>{post.message}</Text>
        <Text style={styles.likers}>{amountLikes}</Text>
        {fav ? (
          // Si le post est liké, alors on affiche le coeur plein,
          <Image
            style={styles.fav}
            onClick={() => handleFav()}
            source={require("../assets/images/heart-solid.png")}
            alt="yesFav"
          />
        ) : (
          // sinon on affiche le coeur vide
          <Image
            style={styles.fav}
            onClick={() => handleFav()}
            source={require("../assets/images/heart-regular.png")}
            alt="noFav"
          />
        )}
      </View>
      <Text style={styles.datetime}>{changeDateFormat(post.createdAt)}</Text>
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
  messageHeader: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center"
  },
  author: {
    fontSize: "0.75rem",
    color: "#FF6C37"
  },
  logo: {
    height: "8px",
    width: "8px",
    cursor: "pointer"
  },
  messageContent: {
    backgroundColor: "#FFFFFF",
    border: "solid 1px #FF6C37",
    borderRadius: "10px",
    marginTop: "2.5px",
    marginBottom: "2.5px",
    padding: "10px"
  },
  likers: {
    color: "#FF6C37",
    position: "absolute",
    right: "32px",
    bottom: 0,
    transform: "translate(50%, 100%)"
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
