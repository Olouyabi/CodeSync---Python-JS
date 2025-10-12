import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
    code: string;
    language: 'python' | 'javascript';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4 rounded-lg bg-gray-900 dark:bg-black/50 relative text-sm">
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                <span className="text-gray-400 font-mono">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-xs"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-4 h-4 text-green-400"/>
                            <span>Copié !</span>
                        </>
                    ) : (
                        <>
                           <ClipboardIcon className="w-4 h-4"/>
                           <span>Copier</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className={`language-${language} text-white`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};