import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, // Array of { label, value }
  placeholder = "Selecciona una opción", 
  searchable = false,
  triggerStyle = {},
  containerStyle = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When opening, focus search input if searchable
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      // Small timeout to allow animation to start before focus steals it
      setTimeout(() => inputRef.current.focus(), 50);
    }
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen, searchable]);

  function normStr(str) {
    if (!str) return '';
    let s = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (s.includes("cdmx")) s += " ciudad de mexico";
    if (s.includes("edomex") || s.includes("edo mex") || s.includes("estado")) s += " estado de mexico";
    if (s.includes("tlanepantla")) s += " tlalnepantla";
    if (s.includes("naulcapan")) s += " naucalpan";
    if (s.includes("zaragosa")) s += " zaragoza";
    if (s.includes("cautitlan")) s += " cuautitlan";
    return s;
  }

  const query = normStr(search);

  const filteredOptions = (searchable && query !== '')
    ? options.filter((opt, idx, arr) => {
        if (opt.isHeader) {
          const headerMatches = normStr(opt.label).includes(query);
          const nextHeaderIdx = arr.findIndex((item, i) => i > idx && item.isHeader);
          const endIdx = nextHeaderIdx === -1 ? arr.length : nextHeaderIdx;
          const groupItems = arr.slice(idx + 1, endIdx);
          return headerMatches || groupItems.some(item => !item.isHeader && normStr(item.label).includes(query));
        }

        let parentHeader = null;
        for (let i = idx - 1; i >= 0; i--) {
          if (arr[i].isHeader) {
            parentHeader = arr[i];
            break;
          }
        }
        const parentHeaderMatches = parentHeader && normStr(parentHeader.label).includes(query);

        return normStr(opt.label).includes(query) || parentHeaderMatches;
      })
    : options;

  const selectedOption = options.find(opt => !opt.isHeader && opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', ...containerStyle }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          ...triggerStyle
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.svg 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              marginTop: '4px',
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {searchable && (
              <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', background: '#f9f9f9' }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}
            <div
              className="custom-scrollbar"
              onTouchMove={(e) => e.stopPropagation()}
              style={{
                maxHeight: '280px',
                overflowY: 'auto',
                background: 'var(--white)',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
              }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  if (opt.isHeader) {
                    return (
                      <div
                        key={`header-${opt.label}-${idx}`}
                        style={{
                          padding: '8px 16px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--text-soft)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          background: '#f4f4f4',
                          borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                          borderBottom: '1px solid var(--border)',
                          userSelect: 'none'
                        }}
                      >
                        {opt.label}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={opt.value || opt.label}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        background: value === opt.value ? 'var(--beige)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        color: 'var(--charcoal)',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        if (value !== opt.value) e.target.style.background = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        if (value !== opt.value) e.target.style.background = 'transparent';
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })
              ) : (
                <div style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-soft)', textAlign: 'center' }}>
                  No se encontraron resultados
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
