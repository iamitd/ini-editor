import React, { useState, useEffect } from 'react';
import './TextEditor.css';

const TextEditor = ({ iniContent, updateIniContent }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(iniContent);
    }, [iniContent]);

    const handleContentChange = (event) => {
        const newContent = event.target.value;
        setContent(newContent);
        updateIniContent(newContent);
    };

    return (
        <div className="text-editor-container">
            <textarea
                value={content}
                onChange={handleContentChange}
                rows={10}
                cols={50}
            />
        </div>
    );
};

export default TextEditor;