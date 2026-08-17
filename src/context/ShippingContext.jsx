import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const ShippingContext = createContext(null);
const STORAGE_KEY = 'loredistrict_alcaldia';

function loadAlcaldia() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ShippingProvider({ children }) {
  const [alcaldia, setAlcaldiaState] = useState(loadAlcaldia);
  const [alcaldias, setAlcaldias] = useState([]);
  const [groupedOptions, setGroupedOptions] = useState([]);

  useEffect(() => {
    api.get('settings.php').then(data => {
      const zones = data.shipping_zones || {};
      const arr = Object.values(zones).map(z => ({
        name: z.name,
        cost: Number(z.cost),
        state: z.state || 'Ciudad de México'
      }));
      
      const cdmx = arr.filter(z => z.state === 'Ciudad de México').sort((a, b) => a.name.localeCompare(b.name, 'es'));
      const edomex = arr.filter(z => z.state === 'Estado de México').sort((a, b) => a.name.localeCompare(b.name, 'es'));

      setAlcaldias([...cdmx, ...edomex]);

      const opts = [
        { isHeader: true, label: 'Ciudad de México' },
        ...cdmx.map(a => ({ label: a.name, value: a.name })),
        { isHeader: true, label: 'Estado de México' },
        ...edomex.map(a => ({ label: a.name, value: a.name }))
      ];
      setGroupedOptions(opts);

      // Update stored alcaldia cost if it exists
      if (alcaldia) {
        const updated = arr.find(a => a.name === alcaldia.name);
        if (updated && updated.cost !== alcaldia.cost) {
          setAlcaldiaState(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      }
    }).catch(console.error);
  }, []);

  function setAlcaldia(name) {
    const found = alcaldias.find((a) => a.name === name);
    if (!found) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    setAlcaldiaState(found);
  }

  return (
    <ShippingContext.Provider
      value={{
        alcaldias,
        groupedOptions,
        alcaldia,
        shippingCost: alcaldia?.cost ?? 0,
        setAlcaldia,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  return useContext(ShippingContext);
}
