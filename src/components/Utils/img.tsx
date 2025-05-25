const ImagePreview = ({ base64 }: { base64: string | null }) => {
  if (!base64) return null;
  
  return (
    <div style={{ marginTop: '10px' }}>
      <img 
        src={`data:image/jpeg;base64,${base64}`} 
        alt="Preview" 
        style={{ maxWidth: '100%', maxHeight: '200px' }}
      />
    </div>
  );
};

export default ImagePreview