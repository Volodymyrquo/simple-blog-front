import React, {useMemo, useCallback,useState, useRef, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios'

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth);
const inputFileRef = useRef(null)
const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');

const isEditing = Boolean(id)
  const handleChangeFile = async(event) => {
try {
  const formData = new FormData()
  const file =  event.target.files[0];
  formData.append('image',file)
  const {data} = await axios.post('/upload',formData)
  setImageUrl(data.url)
} catch (error) {
  console.warn(error);
  alert('Error when file uploading')
}
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async()=>{
try {
  setIsLoading(true);
  const fields = {
    title,
    imageUrl,
    tags,
    text
  }

  const {data}=isEditing
  ?await axios.patch(`/posts/${id}`,fields)
  :await axios.post('/posts',fields)
  const postId = isEditing? id: data._id
  navigate(`/posts/${postId}`)
} catch (error) {
  console.warn(error)
  alert("Error article creating")
}
  }

  useEffect(()=>{
    console.log({id})
if(id){
  axios.get(`/posts/${id}`)
  .then(({data})=>{
    setTitle(data.title);
    setText(data.text);
    setImageUrl(data.imageUrl);
    setTags(data.tags.join(','));
  })
  .catch(err=>{
    console.warn(err);
  alert("Error edit article")
  })
}
  },[id])
  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
  if(!window.localStorage.getItem('token') && !isAuth){
    return <Navigate to='/'/>
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=>inputFileRef.current.click()} variant="outlined" size="large">
     Load preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden  />
      {imageUrl && (
        <>  
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />

        </>

      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e=>setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" value={tags} onChange={e=>setTags(e.target.value)} fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing?'Save':'Public'}
        </Button>
        <a href="/">
          <Button size="large">Reject</Button>
        </a>
      </div>
    </Paper>
  );
};
