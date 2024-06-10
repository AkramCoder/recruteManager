import React, { useState } from 'react';
import { Document, Page, pdfjs} from 'react-pdf';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
// import PDFViewer from './PDFViewer';

const FileViewer = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileSelected = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile)
    if (selectedFile) {
        setFileName(selectedFile.name)
        const reader = new FileReader();
        reader.onload = (e) => {
            setFile(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div>
      <div>
        <h3>Click here to upload a PDF or Word document:</h3>
        <input type="file" accept=".pdf, .doc, .docx" onChange={handleFileSelected} />
      </div>

      {file && (
        <div>
          <h3>Uploaded File:</h3>
          <div className="file-preview">
            {fileName.endsWith('.pdf') ? (
                <div>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
              </div>
            ) : fileName.endsWith('.doc') || fileName.endsWith('.docx') ? (
              <Viewer fileUrl={file} />
            ) : (
              <p>This file type is not supported for preview.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileViewer;
