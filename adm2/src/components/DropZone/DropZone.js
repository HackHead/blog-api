import React, { useState } from 'react';
import '../../styles/dropzone.css';
import { Button, Typography, Grid } from '@mui/material';

const DropZone = ({url = '', onUpdate}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [src, setSrc] = useState(url);
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    onUpdate(files[0]);
    
    setSrc(URL.createObjectURL(files[0]))

  };

  return (
    <>
    
     <div
      className={`dropZone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Grid sx={{height: '8rem'}}>
        <label htmlFor={`dropzone-${Date.now()}`} style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
        {isDragging ? <Typography variant="subtitle2" gutterBottom>Отпустите чтобы загрузить</Typography> : <Typography variant="subtitle2" gutterBottom>Загрузить миниатюру</Typography>}
          <input id={`dropzone-${Date.now()}`} type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept='image/*'/>
        </label>
        
      </Grid>
    </div>
    <Grid sx={{mt: '1rem'}}><img src={src} alt=''/></Grid>
    </>
   
  );
};

export default DropZone;
