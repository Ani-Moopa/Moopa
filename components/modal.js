export default function Modal({ open, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-black bg-opacity-50 backdrop-blur-sm" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`shadow rounded-xl transition-all ${
          open ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
