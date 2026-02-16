import React from 'react';

const API_URL = import.meta.env.VITE_API_URL;


function ProcessingReport({ report, onReset }) {
  const { report: processingData, download_url } = report;

  return (
    <div className="card">
      <h2>✅ Traitement terminé avec succès!</h2>
      
      <div className="alert alert-success" style={{ marginTop: '2rem' }}>
        <strong>🎉 Félicitations!</strong> Votre fichier a été nettoyé et normalisé avec succès.
      </div>

      <div className="analysis-grid" style={{ marginTop: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Lignes originales</div>
          <div className="stat-value">{processingData.original_rows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lignes finales</div>
          <div className="stat-value">{processingData.final_rows}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lignes supprimées</div>
          <div className="stat-value">{processingData.rows_removed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Colonnes</div>
          <div className="stat-value">{processingData.final_columns}</div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>📋 Détails du traitement</h3>
      
      {processingData.steps.map((step, index) => (
        <div key={index} className="card" style={{ marginBottom: '1rem', background: '#f8f9ff' }}>
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>
            {index + 1}. {step.step}
          </h4>
          
          {step.step === 'Traitement des valeurs manquantes' && (
            <div>
              <p><strong>Total de valeurs manquantes traitées:</strong> {step.details.total_missing}</p>
              {Object.keys(step.details.columns_with_missing).length > 0 && (
                <>
                  <p style={{ marginTop: '0.5rem' }}><strong>Colonnes concernées:</strong></p>
                  <ul>
                    {Object.entries(step.details.columns_with_missing).map(([col, count]) => (
                      <li key={col}>{col}: {count} valeur(s)</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {step.step === 'Traitement des valeurs aberrantes' && (
            <div>
              <p><strong>Total de valeurs aberrantes détectées:</strong> {step.details.total_outliers}</p>
              {Object.keys(step.details.columns_with_outliers).length > 0 && (
                <>
                  <p style={{ marginTop: '0.5rem' }}><strong>Colonnes concernées:</strong></p>
                  <ul>
                    {Object.entries(step.details.columns_with_outliers).map(([col, count]) => (
                      <li key={col}>{col}: {count} valeur(s)</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {step.step === 'Traitement des doublons' && (
            <div>
              <p><strong>Doublons trouvés:</strong> {step.details.duplicates_found}</p>
              <p><strong>Doublons supprimés:</strong> {step.details.duplicates_removed}</p>
            </div>
          )}

          {step.step === 'Normalisation des données' && (
            <div>
              <p><strong>Méthode de normalisation:</strong> {step.details.method === 'standard' ? 'Standardisation (Z-score)' : 'Min-Max Scaling'}</p>
              {step.details.normalized_columns.length > 0 && (
                <>
                  <p style={{ marginTop: '0.5rem' }}><strong>Colonnes normalisées:</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {step.details.normalized_columns.map((col) => (
                      <span key={col} className="badge badge-primary">{col}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="alert alert-info" style={{ marginTop: '2rem' }}>
        <strong>📁 Fichier de sortie:</strong> {processingData.output_file}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          href={`${API_URL}${download_url}`}
          download
          className="download-link"
        >
          📥 Télécharger le fichier traité
        </a>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={onReset}>
          🔄 Traiter un nouveau fichier
        </button>
      </div>

      <div className="alert alert-success" style={{ marginTop: '2rem' }}>
        <strong>💡 Conseils:</strong>
        <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          <li>Vérifiez les données normalisées avant de les utiliser</li>
          <li>Conservez une copie de vos données originales</li>
          <li>Les données normalisées sont prêtes pour l'analyse ou le machine learning</li>
        </ul>
      </div>
    </div>
  );
}

export default ProcessingReport;
