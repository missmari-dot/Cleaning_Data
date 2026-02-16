import React from 'react';

function AnalysisResults({ data, onContinue, onReset }) {
  const {
    filename,
    rows,
    columns,
    column_names,
    missing_values,
    duplicates,
    outliers,
    numeric_columns,
    categorical_columns,
    preview
  } = data;

  const totalMissing = Object.values(missing_values).reduce((a, b) => a + b, 0);
  const totalOutliers = Object.values(outliers || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="card">
      <h2>📊 Résultats de l'analyse</h2>
      
      <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
        <strong>Fichier analysé:</strong> {filename}
      </div>

      <div className="analysis-grid">
        <div className="stat-card">
          <div className="stat-label">Nombre de lignes</div>
          <div className="stat-value">{rows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Nombre de colonnes</div>
          <div className="stat-value">{columns}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valeurs manquantes</div>
          <div className="stat-value">{totalMissing}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Doublons détectés</div>
          <div className="stat-value">{duplicates}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Colonnes numériques</div>
          <div className="stat-value">{numeric_columns.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valeurs aberrantes</div>
          <div className="stat-value">{totalOutliers}</div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>📋 Détails des colonnes</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom de la colonne</th>
              <th>Type</th>
              <th>Valeurs manquantes</th>
              <th>Valeurs aberrantes</th>
            </tr>
          </thead>
          <tbody>
            {column_names.map((col) => (
              <tr key={col}>
                <td>
                  <strong>{col}</strong>
                  {numeric_columns.includes(col) && (
                    <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>Numérique</span>
                  )}
                  {categorical_columns.includes(col) && (
                    <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>Catégorique</span>
                  )}
                </td>
                <td>{data.column_types[col]}</td>
                <td>
                  {missing_values[col] > 0 ? (
                    <span className="badge badge-warning">{missing_values[col]}</span>
                  ) : (
                    <span className="badge badge-success">0</span>
                  )}
                </td>
                <td>
                  {outliers && outliers[col] ? (
                    <span className="badge badge-danger">{outliers[col]}</span>
                  ) : (
                    <span className="badge badge-success">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>👀 Aperçu des données (5 premières lignes)</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {column_names.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, index) => (
              <tr key={index}>
                {column_names.map((col) => (
                  <td key={col}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : 'N/A'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalMissing > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
          ⚠️ <strong>Attention:</strong> {totalMissing} valeur(s) manquante(s) détectée(s).
          Elles seront traitées lors du processus de nettoyage.
        </div>
      )}

      {duplicates > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          ⚠️ <strong>Attention:</strong> {duplicates} doublon(s) détecté(s).
          Ils seront supprimés lors du processus de nettoyage.
        </div>
      )}

      {totalOutliers > 0 && (
        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          ⚠️ <strong>Attention:</strong> {totalOutliers} valeur(s) aberrante(s) détectée(s).
          Elles seront traitées lors du processus de nettoyage.
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={onReset}>
          ← Retour
        </button>
        <button className="btn btn-primary" onClick={onContinue}>
          Continuer vers le traitement →
        </button>
      </div>
    </div>
  );
}

export default AnalysisResults;
