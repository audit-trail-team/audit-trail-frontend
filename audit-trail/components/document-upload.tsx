'use client'
import React, { ChangeEvent } from 'react';

const UploadAndHash: React.FC = () => {
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                console.log('File loaded:', file.name, file.size, file.type)
                const base64EncodedString = reader.result as string;
                console.log('Base64:', base64EncodedString);
                const base64 = base64EncodedString.split(',')[1]; // Remove the base64 prefix
                console.log('Base64:', base64);
                const hash = await sha256(base64);
                console.log('Hash:', hash);
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
            };
        }
    };

    const sha256 = async (input: string): Promise<string> => {
        const buffer = Buffer.from(input, 'utf8');
        const digest = await window.crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
    };

    return (
        <div>
            <h1>Upload PDF File</h1>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
        </div>
    );
};

export default UploadAndHash;
