import React, {useState, useEffect} from 'react';
import './Post.css';
import {Avatar} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {db} from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl, likes}) {
    const [like, setLike] = useState([
        {
            liked: false,
        }
    ]);

    const [comments, setComments] = useState([]);
    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot( snapshot => {
                setComments(snapshot.docs.map( doc => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const [comment, setComment] = useState("");

    const handleLike = () => {
        if(like.liked) 
        {
            setLike({liked: false});
            db.collection("posts").doc(postId).update({likes: likes-1});
        } else {
            setLike({liked: true});
            db.collection("posts").doc(postId).update({likes: likes+1});
        }
    };

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:  comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() 
        });
        setComment('');
    }
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    alt="Sahil Saha"
                    src=""
                    className="post__avatar"
                />
                <h4>{username}</h4>
            </div>
            
            <img  className="post__image" src={imageUrl} alt="post"/>
            <div className="post__likes">
                {
                    like.liked ?
                        <FavoriteIcon style={{color:"red"}} onClick={handleLike}></FavoriteIcon>
                        :
                        <FavoriteBorderIcon onClick={handleLike}></FavoriteBorderIcon>
                    
                }
                <p style={{marginLeft: "10px"}}>{likes} likes</p>
            </div>
            
            
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {comments.map(comment => (
                    <p>
                        <strong>{comment.username} </strong>{comment.text}
                    </p>
                ))}
            </div>
            {user ? (
                <form className="post__commentBox">
                    <input
                        placeholder="Add a comment..."
                        value={comment}
                        type="text"
                        className="post__input"
                        onChange={(e) => setComment(e.target.value)}
                    />    
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            ) : (<p style={{padding:"20px"}}>You need to be signed in to post a comment...</p>)}    
            
        </div>
    )
}

export default Post
