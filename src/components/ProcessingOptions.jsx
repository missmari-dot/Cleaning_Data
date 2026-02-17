import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;



function ProcessingOptions({ file, analysisData, options, setOptions, onProcessingComplete, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleOptionChange = (key, value) => {
    setOptions({ ...options, [key]: value });
  };

  const processFile = async () => {
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('missing_strategy', options.missing_strategy);
    formData.append('outlier_method', options.outlier_method);
    formData.append('outlier_action', options.outlier_action);
    formData.append('normalization_method', options.normalization_method);
    formData.append('output_format', options.output_format);
    
    // NOUVEAU: Ajouter le paramètre de détection des doublons
    formData.append('duplicate_detection', options.duplicate_detection);
    if (options.duplicate_detection === 'custom' && options.duplicate_columns) {
      formData.append('duplicate_columns', options.duplicate_columns);
    }

    try {
      const response = await axios.post(`${API_URL}/api/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onProcessingComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du traitement du fichier');
    } finally {
      setIsProcessing(false);
    }
  };

  const missingValues = analysisData?.missing_values || {};
  const duplicates = analysisData?.duplicates || 0;
  const duplicatesOnId = analysisData?.duplicates_on_id || 0;
  const outliers = analysisData?.outliers || {};
  const idColumns = analysisData?.id_columns || [];

  const totalIssues =
    Object.values(missingValues).reduce((a, b) => a + b, 0) +
    (options.duplicate_detection === 'id' ? duplicatesOnId : duplicates) +
    Object.values(outliers).reduce((a, b) => a + b, 0);

  return (
    <div className="card">
      <h2>⚙️ Options de traitement</h2>
      
      <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
        <strong>Fichier:</strong> {analysisData.filename}<br />
        <strong>Problèmes détectés:</strong> {totalIssues} 
        {idColumns.length > 0 && (
          <>
            <br />
            <strong>Colonnes ID détectées:</strong> {idColumns.join(', ')}
          </>
        )}
      </div>

      {/* NOUVEAU: Section de détection des doublons */}
      <div className="form-group">
        <label className="form-label">
          🔑 Détection des doublons
        </label>
        <select
          className="form-select"
          value={options.duplicate_detection}
          onChange={(e) => handleOptionChange('duplicate_detection', e.target.value)}
        >
          <option value="all">Toutes les colonnes (lignes identiques à 100%)</option>
          <option value="id">Colonnes ID uniquement (recommandé)</option>
          <option value="custom">Colonnes personnalisées</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          {options.duplicate_detection === 'all' && (
            <>
              Détecte les lignes complètement identiques<br />
              <strong>Doublons détectés: {duplicates}</strong>
            </>
          )}
          {options.duplicate_detection === 'id' && (
            <>
              Détecte les doublons sur les colonnes ID ({idColumns.length > 0 ? idColumns.join(', ') : 'aucune détectée'})<br />
              <strong>Doublons détectés: {duplicatesOnId}</strong>
            </>
          )}
          {options.duplicate_detection === 'custom' && (
            <>Spécifiez les colonnes à vérifier ci-dessous</>
          )}
        </small>
      </div>

      {/* Champ pour colonnes personnalisées */}
      {options.duplicate_detection === 'custom' && (
        <div className="form-group">
          <label className="form-label">
            📝 Colonnes à vérifier (séparées par des virgules)
          </label>
          <input
            type="text"
            className="form-select"
            placeholder="ex: id, email, username"
            value={options.duplicate_columns || ''}
            onChange={(e) => handleOptionChange('duplicate_columns', e.target.value)}
          />
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
            Entrez les noms des colonnes séparés par des virgules
          </small>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          🔧 Stratégie pour les valeurs manquantes
        </label>
        <select
          className="form-select"
          value={options.missing_strategy}
          onChange={(e) => handleOptionChange('missing_strategy', e.target.value)}
        >
          <option value="mean">Moyenne (pour colonnes numériques)</option>
          <option value="median">Médiane (pour colonnes numériques)</option>
          <option value="mode">Mode (valeur la plus fréquente)</option>
          <option value="drop">Supprimer les lignes</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          Définit comment traiter les valeurs manquantes dans le dataset
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">
          📊 Méthode de détection des valeurs aberrantes
        </label>
        <select
          className="form-select"
          value={options.outlier_method}
          onChange={(e) => handleOptionChange('outlier_method', e.target.value)}
        >
          <option value="iqr">IQR (Interquartile Range)</option>
          <option value="zscore">Z-Score</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          IQR: détecte les valeurs en dehors de Q1-1.5×IQR et Q3+1.5×IQR<br />
          Z-Score: détecte les valeurs avec |z| &gt; 3
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">
          🎯 Action sur les valeurs aberrantes
        </label>
        <select
          className="form-select"
          value={options.outlier_action}
          onChange={(e) => handleOptionChange('outlier_action', e.target.value)}
        >
          <option value="cap">Limiter (cap) aux bornes</option>
          <option value="remove">Supprimer les lignes</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          Cap: remplace les valeurs aberrantes par les limites acceptables<br />
          Remove: supprime les lignes contenant des valeurs aberrantes
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">
          📏 Méthode de normalisation
        </label>
        <select
          className="form-select"
          value={options.normalization_method}
          onChange={(e) => handleOptionChange('normalization_method', e.target.value)}
        >
          <option value="standard">Standardisation (Z-score)</option>
          <option value="minmax">Min-Max Scaling (0-1)</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          Standard: transforme les données avec moyenne=0 et écart-type=1<br />
          Min-Max: transforme les données dans l'intervalle [0, 1]
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">
          💾 Format de sortie
        </label>
        <select
          className="form-select"
          value={options.output_format}
          onChange={(e) => handleOptionChange('output_format', e.target.value)}
        >
          <option value="csv">CSV</option>
          <option value="excel">Excel (.xlsx)</option>
          <option value="json">JSON</option>
        </select>
        <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
          Choisissez le format du fichier traité
        </small>
      </div>

      {error && (
        <div className="alert alert-danger">
          ⚠️ {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack} disabled={isProcessing}>
          ← Retour
        </button>
        <button 
          className="btn btn-success" 
          onClick={processFile}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '0.5rem' }}></span>
              Traitement en cours...
            </>
          ) : (
            '🚀 Lancer le traitement'
          )}
        </button>
      </div>

      {isProcessing && (
        <div className="loading" style={{ marginTop: '2rem' }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
          <p>Traitement de vos données en cours...</p>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '1rem auto' }}>
            <li>✅ Traitement des valeurs manquantes</li>
            <li>✅ Détection et traitement des valeurs aberrantes</li>
            <li>✅ Suppression des doublons</li>
            <li>✅ Normalisation des données</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProcessingOptions;