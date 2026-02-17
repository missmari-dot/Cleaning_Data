import React, { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function FileUpload({ onFileUpload, onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();

    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const allowedExtensions = ['csv', 'xlsx', 'xls', 'json', 'xml'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Format de fichier non supporté. Utilisez: CSV, Excel, JSON ou XML');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onFileUpload(file);
      onAnalysisComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'analyse du fichier');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <h2>📁 Télécharger votre fichier</h2>
      
      <div
        className={`dropzone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <div className="dropzone-icon">📤</div>
        <div className="dropzone-text">
          {file ? file.name : 'Glissez-déposez votre fichier ici'}
        </div>
        <div className="dropzone-subtext">
          ou cliquez pour sélectionner un fichier
        </div>
        <div className="dropzone-subtext" style={{ marginTop: '1rem' }}>
          Formats acceptés: CSV, Excel (.xlsx, .xls), JSON, XML
        </div>
      </div>

      <input
        id="fileInput"
        type="file"
        accept=".csv,.xlsx,.xls,.json,.xml"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {file && !error && (
        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          ✅ Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={analyzeFile}
          disabled={!file || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '0.5rem' }}></span>
              Analyse en cours...
            </>
          ) : (
            '🔍 Analyser le fichier'
          )}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
