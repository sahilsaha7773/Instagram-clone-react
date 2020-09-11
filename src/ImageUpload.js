import React, {useState} from 'react';
import firebase from 'firebase';
import {Button} from '@material-ui/core';
import {storage, db} from './firebase';
import './ImageUpload.css';

function ImageUpload({username}){
	const [caption, setCaption] = useState('');
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(null);

	const handleChange = (e) => {
		if(e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				//progress function
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				//Error function
				console.log(error);
			},
			() => {
				//complete function
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						//post image inside db
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
							likes: 0
						});
						setProgress(0);
						setCaption("");
						setImage(null);
					})
			}
		)
	}
	return (
		<div className="imageupload">
			<div className="imageupload__form">
				<progress className="imageupload__progress" value={progress} max="100"/>
				<input type="text" style={{padding:"5px", border: "none"}} placeholder="Enter a caption..." value={caption} onChange={(event) => setCaption(event.target.value)}/>
				<input type="file" style={{marginTop: "5px"}} files={image} onChange={handleChange}/>
				<Button onClick={handleUpload}>
					Upload
				</Button>
			</div>
			
		</div>
	);
}

export default ImageUpload;