import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSocket } from '../api/socket';

const InventoryAlerts = () => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = (data) => {
      // data: { ingredient_id, name, level, threshold }
      if (data.level <= (data.threshold || 5)) {
        toast.error(`Low Stock Alert: ${data.name} is down to ${data.level}`, {
          duration: 5000,
          icon: '⚠️',
          style: {
            background: 'rgba(231, 76, 60, 0.1)',
            color: '#e74c3c',
            border: '1px solid rgba(231, 76, 60, 0.2)',
            backdropFilter: 'blur(10px)',
          }
        });
      }
    };

    socket.on('inventory_update', handleUpdate);

    return () => {
      socket.off('inventory_update', handleUpdate);
    };
  }, []);

  return null;
};

export default InventoryAlerts;
