import React, { useEffect, useRef, useState } from 'react';
import { handleImageError } from '../utils/helpers.js';

const PlayerProfile = ({ player, isVisible, onClose, playerAvatars, onAvatarUpload, t }) => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'success', 'error'
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      // Reset upload status when modal opens
      setUploadStatus(null);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !player) return null;

  const winRate = player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0;
  
  // Get current avatar (prioritize custom uploaded avatar)
  const currentAvatar = playerAvatars[player.name] || player.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=1f2937&color=fff&size=128`;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus('uploading');
      try {
        onAvatarUpload(player.name, file);
        setUploadStatus('success');
        // Auto-hide success message after 2 seconds
        setTimeout(() => setUploadStatus(null), 2000);
      } catch (error) {
        setUploadStatus('error');
        setTimeout(() => setUploadStatus(null), 3000);
      }
    }
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏸 {t("player_profile")}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content-new">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={currentAvatar}
                alt={player.name}
                onError={(e) => handleImageError(e, player.name)}
                onClick={handleAvatarClick}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px solid var(--accent)',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '-8px',
                background: uploadStatus === 'success' ? '#10b981' : uploadStatus === 'error' ? '#ef4444' : 'var(--accent)',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease'
              }} onClick={handleAvatarClick}>
                {uploadStatus === 'uploading' ? '⏳' : uploadStatus === 'success' ? '✅' : uploadStatus === 'error' ? '❌' : '📷'}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{player.name}</h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Win Rate: {winRate}%
            </div>
            {uploadStatus && (
              <div style={{ 
                fontSize: '12px', 
                marginTop: '4px',
                color: uploadStatus === 'success' ? '#10b981' : uploadStatus === 'error' ? '#ef4444' : 'var(--accent)'
              }}>
                {uploadStatus === 'uploading' && '⏳ Uploading avatar...'}
                {uploadStatus === 'success' && '✅ Avatar updated successfully!'}
                {uploadStatus === 'error' && '❌ Upload failed. Try again.'}
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '12px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>
                {player.matches || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t("matches_played")}
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '12px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                {player.wins || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t("wins")}
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '12px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--error)' }}>
                {player.losses || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t("losses")}
              </div>
            </div>
            
            <div style={{ 
              background: 'var(--bg-tertiary)', 
              padding: '12px', 
              borderRadius: '8px', 
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>
                {winRate}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t("win_rate")}
              </div>
            </div>
          </div>
          

          
          <div className="modal-actions-new">
            <button onClick={onClose}>{t("close")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;