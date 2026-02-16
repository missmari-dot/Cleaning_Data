import React, { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import AnalysisResults from './components/AnalysisResults.jsx';
import ProcessingOptions from './components/ProcessingOptions.jsx';
import ProcessingReport from './components/ProcessingReport.jsx';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [processingOptions, setProcessingOptions] = useState({
    missing_strategy: 'mean',
    outlier_method: 'iqr',
    outlier_action: 'cap',
    normalization_method: 'standard',
    output_format: 'csv',
    duplicate_detection: 'id',  // NOUVEAU: par défaut sur détection ID
    duplicate_columns: ''
  });
  const [processingReport, setProcessingReport] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setCurrentStep(2);
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    setCurrentStep(3);
  };

  const handleProcessingComplete = (report) => {
    setProcessingReport(report);
    setCurrentStep(4);
  };

  const resetApp = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setAnalysisData(null);
    setProcessingReport(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1> API de Traitement de Données</h1>
        <p>Automatisation du nettoyage et de la normalisation des données</p>
      </header>

      <div className="stepper">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Upload</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Analyse</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Traitement</div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-title">Résultats</div>
        </div>
      </div>

      <main className="App-main">
        {currentStep === 1 && (
          <FileUpload 
            onFileUpload={handleFileUpload}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {currentStep === 2 && analysisData && (
          <AnalysisResults 
            data={analysisData}
            onContinue={() => setCurrentStep(3)}
            onReset={resetApp}
          />
        )}

        {currentStep === 3 && (
          <ProcessingOptions
            file={uploadedFile}
            analysisData={analysisData}
            options={processingOptions}
            setOptions={setProcessingOptions}
            onProcessingComplete={handleProcessingComplete}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && processingReport && (
          <ProcessingReport
            report={processingReport}
            onReset={resetApp}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>@miryamisi</p>
        <p>2026</p>
      </footer>
    </div>
  );
}

export default App;