import React, { useState, useEffect } from 'react';
import TextEditor from './components/TextEditor';
import GraphicsEditor from './components/GraphicsEditor';
import './App.css';
const App = () => {
    const [mode, setMode] = useState('text');
    const [iniContent, setIniContent] = useState('');
    const [savedFiles, setSavedFiles] = useState([]);

    useEffect(() => {
        const storedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
        setSavedFiles(storedFiles);
    }, []);

    const updateIniContent = (content) => {
        setIniContent(content);
    };

    const handleCreateNewFile = () => {
        const newContent = '; Новый INI файл\n\n[Section1]\nKey1 = Value1\nKey2 = Value2';
        setIniContent(newContent);
        updateIniContent(newContent);
    };

    const handleOpenFile = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    setIniContent(content);
                    updateIniContent(content);

                    const fileName = file.name;
                    const newFile = { name: fileName, content };
                    const updatedFiles = [...savedFiles, newFile];
                    localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
                    setSavedFiles(updatedFiles);

                };

                reader.readAsText(file);

            }
        });

        fileInput.click();
    };

    const handleSaveFile = () => {
        const fileName = prompt('Введите имя файла (без расширения):');
        if (!fileName) {
            // Если пользователь не ввел имя файла, просто выходим из функции
            return;
        }
        const updatedFiles = [...savedFiles, { name: fileName, content: iniContent }];
        setSavedFiles(updatedFiles);
        localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
    };
    const handleOpenSavedFile = (content) => {
        setIniContent(content);
        updateIniContent(content);
    };

    return (
        <div className="app-container">
            <div className="container">
                <div className="button-container">
                    <button onClick={() => setMode('text')}>
                        Текстовый режим
                    </button>
                    <button onClick={() => setMode('graphics')}>
                        Графический режим
                    </button>
                </div>
                {mode === 'text' ? (
                    <TextEditor iniContent={iniContent} updateIniContent={updateIniContent} />
                ) : (
                    <GraphicsEditor iniContent={iniContent} updateIniContent={updateIniContent} />
                )}
                <div className="button-container">
                    <button onClick={handleCreateNewFile}>Создать новый ini файл</button>
                    <button onClick={handleOpenFile}>Открыть ini файл</button>
                    <button onClick={handleSaveFile}>Сохранить ini файл</button>
                </div>
            </div>
            <div className="saved-files-container">
                <div className="saved-files-heading">Сохраненные файлы</div>
                <ul className="saved-files-list">
                    {savedFiles.map((file, index) => (
                        <li
                            key={index}
                            className="saved-file-item"
                            onClick={() => handleOpenSavedFile(file.content)}
                        >
                            {file.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
