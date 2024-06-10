import React, { useEffect, useState } from "react"
import { Viewer, Worker, PdfJs } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

import TextSelectionListener from "../pages/update/TextSelectionListener"
import { pdfjs } from "react-pdf"
import { API_URL } from "../constants"
import axios from "axios"

const PDFViewer = (props) => {
// Create new plugin instance
const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
// for onchange event
const [pdfFile, setPdfFile]=useState(null);
const [selectedPdfFile, setSelectedPdfFile]=useState(null);

const [pdfFileError, setPdfFileError]=useState('');

// for submit event
const [viewPdf, setViewPdf]=useState(null);
const [text, setText] = useState("");
const [extractText, setExtractText] = useState(false)

const [cv_file, setCv_file] = useState("")
// const [tags, setTags] = useState([])
// const [treated, setTreated] = useState(false)
// const [candidate, setCandidate] = useState("")

// onchange event
const fileType=['application/pdf'];
const handlePdfFileChange=(e)=>{
  let selectedFile=e.target.files[0];
  if(selectedFile){
    setSelectedPdfFile(selectedFile)
    props.handelCvSelected(selectedFile)
    if(selectedFile&&fileType.includes(selectedFile.type)){
      let reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onloadend = (e) =>{
            setPdfFile(e.target.result);
            setPdfFileError('');
          }
    }
    else{
      setPdfFile(null);
      setPdfFileError('Please select valid pdf file');
    }
  }
  else{
    console.log('select your file');
  }
}

// form submit
const handlePdfFileSubmit=()=>{
  if(pdfFile!==null){
    setViewPdf(pdfFile);
    setExtractText(true)
  }
  else{
    setViewPdf(null);
    setExtractText(false)
  }
}

const getData = async (text) => {
  await axios({
    method: 'POST',
    url: `${API_URL}user/process-text/`, 
    data: {input_text: text},
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(response => {
      props.handleCallBack(response.data)
  }).catch(error => {
      console.log(error)
  })
} 

const extractTextFromPdf = async () => {
  console.log('extractTextFromPdf')
  if (viewPdf) {
    console.log('extractTextFromPdf t')
    // Initialize the PDFJS worker
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    try {
      // Load the PDF
      const loadingTask = pdfjs.getDocument(viewPdf);
      const pdfDocument = await loadingTask.promise;

      let extractedText = "";

      // Extract text from each page
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item) => {
          extractedText += item.str.trim() + " ";
        });
      }

      extractedText = extractedText.trim().toLowerCase();
      console.log(extractedText)
      setText(extractedText);
      getData(extractedText)
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  }
  setExtractText(false)
};

const getSelectedDataType = (data) => {
  props.handleCustomCallBack(data)
}

useEffect(() => {
  if (extractText) {
    extractTextFromPdf()
  } else {
    handlePdfFileSubmit()
  }
  
}, [pdfFile, viewPdf])


return (
  <div className='container' style={{'padding': '0px', 'margin-top': '20px'}}>

  <br></br>
  
    <form className='form-group' onSubmit={handlePdfFileSubmit} encType="multipart/form-data">
      <input type="file" className='form-control'
        required onChange={handlePdfFileChange}
      />
      {pdfFileError&&<div className='error-msg'>{pdfFileError}</div>}
      <br></br>
      {/* <button type="submit" className='btn btn-success btn-lg'>
        UPLOAD
      </button> */}
    </form>
    <div className='pdf-container' style={{'overflow': 'auto', 'height': '615px'}}>
      {/* show pdf conditionally (if we have one)  */}
      {viewPdf&&<><Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={viewPdf}
          plugins={[defaultLayoutPluginInstance]} />
    </Worker></>}

    {/* if we dont have pdf or viewPdf state is null */}
    {!viewPdf&&<>No pdf file selected</>}
    </div>

    {/* <TextSelectionListener handleCallBack={getSelectedDataType}/> */}
  </div>
)
}

export default PDFViewer