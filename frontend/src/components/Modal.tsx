interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
      <div className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
export function InfoModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md text-center shadow-lg">
        <div className="text-green-500 text-5xl mb-4">ℹ️</div>
        <h2 className="text-xl font-bold mb-2">Se ha cerrado tu sesión</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}

