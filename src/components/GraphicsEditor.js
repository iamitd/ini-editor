import React, { useState, useEffect } from 'react';
import './GraphicsEditor.css';

const GraphicsEditor = ({ iniContent, updateIniContent }) => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        setSections(parseIniContent(iniContent));
    }, [iniContent]);

    const handleChange = (type, sectionIndex, keyIndex, value) => {
        const updatedSections = [...sections];
        if (type === 'section') {
            if (updatedSections[sectionIndex]) {
                updatedSections[sectionIndex].name = value;
            }
        } else if (type === 'key') {
            if (updatedSections[sectionIndex] && updatedSections[sectionIndex].keys[keyIndex]) {
                updatedSections[sectionIndex].keys[keyIndex].name = value;
            }
        } else if (type === 'value') {
            if (updatedSections[sectionIndex] && updatedSections[sectionIndex].keys[keyIndex]) {
                updatedSections[sectionIndex].keys[keyIndex].value = value;
                if (updatedSections[sectionIndex] && updatedSections[sectionIndex].keys[keyIndex]) {
                    const isNumeric = (value) => {
                        return value.trim() !== '' && !isNaN(value);
                    };
                    updatedSections[sectionIndex].keys[keyIndex].inputType = isNumeric(value) ? 'number' : 'text';
                }
            }
        }
        setSections([...updatedSections]);
        updateIniContent(stringifyIniContent(updatedSections));
    };

    const addSection = () => {
        const updatedSections = [...sections, { name: '', keys: [] }];
        setSections([...updatedSections]);
        updateIniContent(stringifyIniContent(updatedSections));
    };

    const removeSection = (sectionIndex) => {
        const updatedSections = [...sections];
        updatedSections.splice(sectionIndex, 1);
        setSections([...updatedSections]);
        updateIniContent(stringifyIniContent(updatedSections));
    };
    const addKey = (sectionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].keys.push({ name: '', value: '', isNumeric: false });
        setSections([...updatedSections]);
        updateIniContent(stringifyIniContent(updatedSections));
    };

    const removeKey = (sectionIndex, keyIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].keys.splice(keyIndex, 1);
        setSections([...updatedSections]);
        updateIniContent(stringifyIniContent(updatedSections));
    };

    // Функция для парсинга INI контента
    const parseIniContent = (content) => {
        const lines = content.split('\n');
        let currentSection = null;
        const sections = [];

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith(';')) {
            } else if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
                currentSection = {
                    name: trimmedLine.slice(1, -1),
                    keys: [],
                };
                sections.push(currentSection);
            } else if (currentSection && trimmedLine.includes('=')) {
                const [key, value] = trimmedLine.split('=').map((item) => item.trim());

                const isNumeric = (value) => {
                    return value.trim() !== '' && !isNaN(value);
                };

                const parsedValue = isNumeric(value) ? parseFloat(value) : value;

                const inputType = isNumeric(value) ? 'number' : 'text';

                currentSection.keys.push({ name: key, value: parsedValue, inputType });
            }
        });

        return sections;
    };

    // Функция для преобразования массива объектов в строку INI контента
    const stringifyIniContent = (sections) => {
        return sections
            .map((section) => {
                const sectionString = `[${section.name}]`;
                const keysString = section.keys.map((key) => `${key.name} = ${key.value}`).join('\n');
                return `${sectionString}\n${keysString}`;
            })
            .join('\n\n');
    };

    return (
        <div className="graphics-editor-container">
            {sections.map((section, sectionIndex) => (
                <div className="section-container" key={sectionIndex}>
                    <div>
                        <button className="remove-button" onClick={() => removeSection(sectionIndex)}>✖</button>
                        <label>Секция:</label>
                        <input
                            type="text"
                            value={section.name}
                            onChange={(e) => {
                                handleChange('section', sectionIndex, '', e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        {section.keys.map((key, keyIndex) => (
                            <div className='section-content-container' key={keyIndex}>
                                <div>
                                    <button className="remove-button" onClick={() => removeKey(sectionIndex, keyIndex)}>✖</button>
                                    <label>Ключ:</label>
                                    <input
                                        type="text"
                                        value={key.name}
                                        onChange={(e) => {
                                            handleChange('key', sectionIndex, keyIndex, e.target.value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label>Значение:</label>
                                    <input
                                        type={key.inputType || 'text'}
                                        value={key.value}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            handleChange('value', sectionIndex, keyIndex, inputValue);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addKey(sectionIndex)}>Добавить ключ</button>
                    </div>
                </div>
            ))}
            <button onClick={addSection}>Добавить секцию</button>
        </div>
    );
};

export default GraphicsEditor;
