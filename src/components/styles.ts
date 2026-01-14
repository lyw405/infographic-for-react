export const errorOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  color: '#d32f2f',
  padding: '20px',
  zIndex: 1,
  textAlign: 'center',
};

export const errorTitleStyles: React.CSSProperties = {
  fontSize: '1.2em',
  fontWeight: 'bold',
  marginBottom: '10px',
};

export const errorMessageStyles: React.CSSProperties = {
  marginBottom: '15px',
};

export const retryButtonStyles: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export const errorBoundaryContainerStyles: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#fee',
  border: '1px solid #fcc',
  borderRadius: '4px',
  color: '#c33',
};

export const errorBoundaryTitleStyles: React.CSSProperties = {
  marginTop: 0,
};

export const errorBoundaryStackStyles: React.CSSProperties = {
  marginTop: '10px',
  padding: '10px',
  backgroundColor: 'white',
  borderRadius: '4px',
  overflow: 'auto',
};

export const errorBoundaryRetryButtonStyles: React.CSSProperties = {
  marginTop: '15px',
  padding: '8px 16px',
  backgroundColor: '#c33',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
