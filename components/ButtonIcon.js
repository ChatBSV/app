import React from 'react';

export default function ButtonIcon({ icon, text, onClick }) {

  return (
    <div 
        className="bg-darkBackground-700 rounded-full border m-0 hover:bg-darkBackground-900"
        onClick={onClick}
    >
        <div className="flex gap-x-3 pr-6">
            <img src={icon}
                    className="inline-block w-8 h-8 border-black/50 rounded-full border-r border-t border-b opacity-90 bg-darkBackground-900"/>
            <div className="flex flex-col justify-center items-start gap-y-0.5">
                <span className="font-bold text-white/90 leading-4">{text}</span>
            </div>
        </div>
    </div>
  );
}