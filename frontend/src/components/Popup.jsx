// src/components/Popup.js
import React from "react";

export const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-[#2d336b] text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in-down">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-sm text-white hover:text-[#a9b5df] transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};