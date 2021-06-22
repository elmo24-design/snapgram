import { useState } from "react";
import AddIcon from '@material-ui/icons/Add';
import ProgressBarUpload from "./ProgressBarUpload";

const UploadImage = () => {
   const [file, setFile] = useState(null)
   const [error, setError] = useState(null)

   const types = ['image/png', 'image/jpeg'] 

   const changeHandler = (e) => {
      let selected = e.target.files[0]

      if(selected && types.includes(selected.type)){
         setFile(selected)
         setError('')
      }else{
         setFile(null)
         setError('Please select an image file (png or jpeg)')
      }
   }

   return ( 
      <div>
         <form className="upload-image-form">
            <label className="upload-image-label">
               <input type="file" onChange={changeHandler} accept="image/*"/>
               <div className="add-icon-image">
                  <AddIcon/>
               </div>
            </label>
         </form>
         <div className="output">
            {error && (
               <div className="error-upload-image">
                  {error}
               </div>
            )}
            {
               file && <ProgressBarUpload file={file} setFile={setFile}/>
            }
         </div>
      </div>      
   );
}
 
export default UploadImage;