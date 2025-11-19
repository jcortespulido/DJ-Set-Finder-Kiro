/**
 * GlobalStyles Component
 * 
 * Define estilos CSS globales para temas de neón, efectos hover,
 * transiciones y clases de utilidad para la aplicación.
 */

export function GlobalStyles() {
  return (
    <style>{`
      /* ===== NEON ACCENT CLASSES ===== */
      .neon-accent-cyan { color: #00f2ea; text-shadow: 0 0 10px #00f2ea; }
      .neon-accent-violet { color: #d15fff; text-shadow: 0 0 10px #d15fff; }
      .neon-accent-blue { color: #4df9ff; text-shadow: 0 0 10px #4df9ff; }
      .neon-accent-red { color: #ff4747; text-shadow: 0 0 10px #ff4747; }
      .neon-accent-green { color: #39ff14; text-shadow: 0 0 10px #39ff14; }
      .neon-accent-orange { color: #ff8c00; text-shadow: 0 0 10px #ff8c00; }
      .neon-accent-pink { color: #ff1493; text-shadow: 0 0 10px #ff1493; }
      .neon-accent-ultra-orange { color: #ff7f00; text-shadow: 0 0 10px #ff7f00; }
      .neon-accent-diynamic-blue { color: #007bff; text-shadow: 0 0 10px #007bff; }
      .neon-accent-yellow { color: #ffff00; text-shadow: 0 0 10px #ffff00; }

      /* ===== NEON BORDER CLASSES ===== */
      .border-neon-cyan { border-color: #00f2ea; box-shadow: 0 0 5px #00f2ea; }
      .border-neon-violet { border-color: #d15fff; box-shadow: 0 0 5px #d15fff; }
      .border-neon-blue { border-color: #4df9ff; box-shadow: 0 0 5px #4df9ff; }
      .border-neon-red { border-color: #ff4747; box-shadow: 0 0 5px #ff4747; }
      .border-neon-green { border-color: #39ff14; box-shadow: 0 0 5px #39ff14; }
      .border-neon-orange { border-color: #ff8c00; box-shadow: 0 0 5px #ff8c00; }
      .border-neon-pink { border-color: #ff1493; box-shadow: 0 0 5px #ff1493; }
      .border-neon-ultra-orange { border-color: #ff7f00; box-shadow: 0 0 5px #ff7f00; }
      .border-neon-diynamic-blue { border-color: #007bff; box-shadow: 0 0 5px #007bff; }
      .border-neon-yellow { border-color: #ffff00; box-shadow: 0 0 5px #ffff00; }

      /* ===== CAMELOT KEY COLORS ===== */
      .camelot-key-cyan { background-color: #00f2ea; color: #0d0a1d; }
      .camelot-key-violet { background-color: #d15fff; color: #0d0a1d; }
      .camelot-key-blue { background-color: #4df9ff; color: #0d0a1d; }
      .camelot-key-red { background-color: #ff4747; color: #0d0a1d; }
      .camelot-key-green { background-color: #39ff14; color: #0d0a1d; }
      .camelot-key-orange { background-color: #ff8c00; color: #0d0a1d; }
      .camelot-key-pink { background-color: #ff1493; color: #0d0a1d; }
      .camelot-key-ultra-orange { background-color: #ff7f00; color: #0d0a1d; }
      .camelot-key-diynamic-blue { background-color: #007bff; color: #0d0a1d; }
      .camelot-key-yellow { background-color: #ffff00; color: #0d0a1d; }

      /* ===== TABLE STYLES ===== */
      .table-header {
        background-color: #1a1a2e;
        border-bottom: 2px solid #00f2ea;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .table-row {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
      }

      .table-row:hover {
        background-color: rgba(0, 242, 234, 0.05);
        border-color: rgba(0, 242, 234, 0.3);
      }

      .table-cell {
        padding: 12px 16px;
        text-align: left;
      }

      /* ===== HOVER EFFECTS ===== */
      .hover-neon-cyan:hover {
        color: #00f2ea;
        text-shadow: 0 0 10px #00f2ea;
        transition: all 0.3s ease;
      }

      .hover-border-neon:hover {
        border-color: #00f2ea;
        box-shadow: 0 0 15px rgba(0, 242, 234, 0.5);
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }

      .hover-scale:hover {
        transform: scale(1.02);
        transition: transform 0.2s ease;
      }

      /* ===== CARD STYLES ===== */
      .card-neon {
        background-color: #1a1a2e;
        border: 1px solid rgba(0, 242, 234, 0.3);
        border-radius: 8px;
        padding: 20px;
        transition: all 0.3s ease;
      }

      .card-neon:hover {
        border-color: #00f2ea;
        box-shadow: 0 0 20px rgba(0, 242, 234, 0.3);
        transform: translateY(-4px);
      }

      /* ===== BUTTON STYLES ===== */
      .btn-neon {
        background-color: transparent;
        border: 2px solid #00f2ea;
        color: #00f2ea;
        padding: 10px 24px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-neon:hover {
        background-color: #00f2ea;
        color: #0d0a1d;
        box-shadow: 0 0 20px rgba(0, 242, 234, 0.5);
      }

      .btn-neon:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ===== SCROLLBAR STYLES ===== */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #1a1a2e;
      }

      ::-webkit-scrollbar-thumb {
        background: #00f2ea;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #4df9ff;
      }

      /* ===== ANIMATIONS ===== */
      @keyframes pulse-neon {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }

      .animate-pulse-neon {
        animation: pulse-neon 2s ease-in-out infinite;
      }

      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(0, 242, 234, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(0, 242, 234, 0.8);
        }
      }

      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }

      /* ===== UTILITY CLASSES ===== */
      .text-shadow-neon {
        text-shadow: 0 0 10px currentColor;
      }

      .backdrop-blur-neon {
        backdrop-filter: blur(10px);
        background-color: rgba(13, 10, 29, 0.8);
      }

      .divider-neon {
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          #00f2ea,
          transparent
        );
      }
    `}</style>
  );
}
