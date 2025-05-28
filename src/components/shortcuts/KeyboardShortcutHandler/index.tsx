import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KeyboardShortcutHandler = ({ closeSidebar }: { closeSidebar: () => void }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F6') {
        event.preventDefault();
        closeSidebar();
        navigate('/pdv-mesa');
      }
      if (event.key === 'F7') {
        event.preventDefault();
        closeSidebar();
        navigate('/vendas-loja');
      }
      if (event.key === 'F8') {
        event.preventDefault();
        closeSidebar();
        navigate('/stock');
      }
      if (event.key === 'F5') {
        event.preventDefault();
        closeSidebar();
        navigate('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSidebar, navigate]);

  return null;
};

export default KeyboardShortcutHandler;
