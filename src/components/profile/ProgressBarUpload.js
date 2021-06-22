import React, { useEffect } from 'react';
import useUploadImage from '../../hooks/useUploadImage';
import { motion } from 'framer-motion';

const ProgressBarUpload = ({file, setFile}) => {
   const {progress, url} = useUploadImage(file)

   useEffect(() => {
      if(url){
         setFile(null)
      }
   }, [url,setFile])

   return ( 
      <motion.div className="progress-bar"
         initial={{ width: 0}}
         animate={{ width: progress + '%'}}
      >
      </motion.div>
   );
}
 
export default ProgressBarUpload;