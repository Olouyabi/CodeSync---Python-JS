import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

// To inform TypeScript about Prism on the window object
declare global {
    interface Window {
        Prism: {
            highlightAll: () => void;
        };
    }
}

interface CodeBlockProps {
  code: string;
  language: string;
  fileName: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Trigger highlighting when code or language changes
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy code: ', err);
    });
  };
  
  const handleDownload = () => {
    const fileExtension = language === 'python' ? 'py' : 'js';
    const fullFileName = `${fileName}.${fileExtension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languageName = language === 'javascript' ? 'JavaScript' : 'Python';

  return (
    // Using the exact background from the Prism theme for a seamless look.
    // Added a shadow and rounded corners for a modern, elevated feel.
    <div className="bg-[#2d2d2d] rounded-lg shadow-lg overflow-hidden">
      {/* Custom Header for language name and actions */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50">
        <span className="text-gray-300 text-sm font-mono font-semibold">{languageName}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-gray-300 hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            aria-label="Download code"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-300 hover:bg-gray-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            aria-label="Copy code"
          >
            {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* The `pre` tag is now transparent to show the container's background */}
      <pre className={`language-${language} line-numbers !text-sm !overflow-x-auto !my-0 !p-4 !rounded-none !bg-transparent`}>
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};