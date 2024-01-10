import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, IconButton } from '@mui/material';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageForm from './ImageForm';

export function TripDetailsForm({trip, open, performClose, performSubmit}) {
    const [image, setImage] = React.useState({ preview: '', data: '' });
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');


    const handleSubmit = async (e) => {
        e.preventDefault()

        // build up all form data to be sent to back end in a FormData object (comes built-in to browser-based JS)
        let formData = new FormData()
        formData.append('file', image.data)

        try {
            // post everything from form (including image data) to backend, where we will save the image file to disk using multer middleware
            // https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/
            const response = await axios.post(`/api/trip/${trip.id}/files`, formData) // see backend for this route
            console.log(response.url)

            performSubmit({
                name: name,
                description: description,
                photo: response.url,
            })
    
            setName('');
            setDescription('')
            setImage({ preview: '', data: '' });
            performClose();
        } catch(err) {
            console.log("upload failure: ", err.message);
        }
    }

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        // create object with data from uploaded image and URL to preview it
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img)
    }

    return (
        <Dialog
            open={open}
            onClose={performClose}
            PaperProps={{
                component: 'form',
                onSubmit: {handleSubmit},
            }}
        >
            <DialogTitle>Trip Details</DialogTitle>
            <DialogContent>
                <TextField autoFocus required margin="dense" id="trip-name" name="name" 
                    label="Trip Title" variant="standard" onChange={(e) => { setName(e.target.value) }}/>
                <TextField id="trip-dsc" name="description" label="Description" 
                    multiline rows={4} onChange={(e) => { setName(e.target.value) }} 
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."/>
                <Avatar src={image.preview ? image.preview : ''}></Avatar>
                <input name="photo" type="file" onChange={handleFileChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick= {performClose}>Close</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export function LocationDetailForm({location, open, performClose, performSubmit}) {
    const [description, setDescription] = React.useState('');    
    const [urls, setUrls] = React.useState(location.files);
    const [inputs, setInput] = React.useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        // build up all form data to be sent to back end in a FormData object (comes built-in to browser-based JS)
        let formData = new FormData()
        inputs.forEach((input, i) => {
            if (input.files.length > 0) {
                formData.append(`file${i}`, input.files[0])
            }
        })

        try {
            const response = await axios.post(`/api/trip/${trip.id}/files`, formData) // see backend for this route

            performSubmit({
                description: description,
                files: [...urls, response],
            })
    
            setDescription('')
            setUrls([]);
            setInput([]);
            performClose();
        } catch(err) {
            console.log("upload failure: ", err.message);
        }
    }

    const handleFileAdd = (e) => {
        if (inputs.length < 5) {
            setInput([...inputs, (<input name="files" type="file" />)]);
        }
    }

    const handleRemoveLink = (url) => {
        let newUrls = [...urls].filter((u) => { u != url});
        setUrls(newUrls);
    }

    return(
        <Dialog
            open={open}
            onClose={performClose}
            PaperProps={{
                component: 'form',
                onSubmit: {handleSubmit},
            }}
        >
            <DialogTitle>Location Details</DialogTitle>
            <DialogContent>
                <TextField autoFocus required margin="dense" id="trip-name" name="name" 
                    label="Trip Title" variant="standard" onChange={(e) => { setName(e.target.value) }}/>
                <TextField id="trip-dsc" name="description" label="Description" 
                    multiline rows={4} onChange={(e) => { setName(e.target.value) }} />
                <Avatar src={image.preview ? image.preview : ''}></Avatar>

                {
                    // add the urls
                    urls.map((url, i) =>{
                        return (
                            <div>
                                <Link target="_blank" sx={{paddingLeft:'8px'}} href={url}>Uploaded Document {i}</Link>
                                <IconButton onClick={() => { handleRemoveLink(url) }}><DeleteForeverOutlinedIcon/></IconButton>
                            </div>
                        )
                    })
                }

                {
                    // add the file uploads
                    inputs.map((input, i) => {
                        return(
                            input.element
                        )
                    })
                }

                <IconButton onClick={handleFileAdd}><PostAddOutlinedIcon/></IconButton>
            </DialogContent>
            <DialogActions>
                <Button onClick= {performClose}>Close</Button>
                <Button type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export function UploadProfilePictureForm({performClose, open}) {
    return (
        <Dialog open={open}>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogContent>
                <ImageForm performClose={performClose}/>
            </DialogContent>
        </Dialog>
    )
}

export function EditPermissionForm({location, open, onClose, onSubmit}) {

}