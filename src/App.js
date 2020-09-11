import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: "70%",
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px",
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [modalStyle] = useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //logged out
        setUser(null);
      }
    })

    return () => {
      //perform cleanup before refiring useEffect again
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  
  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      });
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));

    setOpenSignIn(false);
  }
  return (
    <div className="app">
      
      
      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                className="app__headerImage"
                alt="logo"/>
             </center>   
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />  
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signUp}>Sign up</Button>
            
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                className="app__headerImage"
                alt="logo"/>
             </center>   
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signIn}>Sign In</Button>
            
          </form>
        </div>
      </Modal>
      <Modal
        open={openUpload}
        onClose={()=> setOpenUpload(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                className="app__headerImage"
                alt="logo"/>
             </center>   
             {user?.displayName ? 
                (<ImageUpload username={user.displayName}/>)
                :
                (<h3>Sorry you need to log in to upload</h3>)
              }
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          className="app__headerImage"
          alt="logo"/>
        {user ? 
          (
            <div style={{padding:"20px", textAlign:"center", display: "flex"}}>
              
              <AddCircleOutlineIcon onClick={()=>setOpenUpload(true)} style={{paddingTop: "5px"}}></AddCircleOutlineIcon>
              <Button onClick={()=>auth.signOut()}>Log Out</Button>
              
            </div>
          )
          :(
          <div className="app__loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
          )
        }  
      </div>
      
        {user && (
          <div style={{width:"60%", marginLeft:"auto", marginTop:"20px", marginRight:"auto", textAlign:"center"}}>
            <h3>Hi {user.displayName}!</h3>
          </div>
          
        )}
      
      <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <div>
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} likes={post.likes}/>
            </div>  
          ))
        }

      </div>
      
      
    </div>
    
  );
}

export default App;
