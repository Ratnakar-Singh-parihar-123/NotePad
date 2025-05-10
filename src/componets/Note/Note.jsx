import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './Note.css';

function Note() {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [noteColor, setNoteColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(16);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const [editIndex, setEditIndex] = useState(null); // State for edit mode

    const addNote = () => {
        if (editIndex !== null) {
            // Update the note if in edit mode
            const updatedNotes = [...notes];
            updatedNotes[editIndex] = {
                ...updatedNotes[editIndex],
                note: currentNote,
                color: noteColor,
                fontSize: fontSize,
            };
            setNotes(updatedNotes);
            setEditIndex(null); // Exit edit mode
        } else {
            // Add a new note
            setNotes([...notes, { page: currentPage, note: currentNote, heading: `Page ${currentPage} Notes`, color: noteColor, fontSize: fontSize }]);
            setCurrentPage(currentPage + 1); // Increment page number
        }
        setCurrentNote(''); // Clear the text area
    };

    const deleteNote = (index) => {
        setNotes(notes.filter((note, i) => i !== index));
        setCurrentPage(currentPage - 1); // Decrement page number
        if (notes.length === 1) {
            setCurrentPage(1); // Reset to page 1 if all notes are deleted
        }
    };

    const editNote = (index) => {
        setEditIndex(index); // Set the index of the note being edited
        setCurrentNote(notes[index].note); // Load the note content into the text area
        setNoteColor(notes[index].color); // Load the note color
        setFontSize(notes[index].fontSize); // Load the font size
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height; // Height of the page
        const marginTop = 10; // Top margin
        const marginBottom = 20; // Bottom margin
        const lineHeight = 10; // Line height for text
        const usableHeight = pageHeight - marginTop - marginBottom; // Usable height on the page

        notes.forEach((note, index) => {
            if (index > 0) {
                doc.addPage(); // Add a new page for each note
            }
            doc.setTextColor(note.color);
            doc.setFontSize(note.fontSize);

            // Add the heading
            doc.text(note.heading, 10, marginTop);

            // Split the note text into lines that fit within the page width
            const textLines = doc.splitTextToSize(note.note, 180);
            let y = marginTop + lineHeight; // Start position for text

            // Loop through the lines and add them to the PDF
            textLines.forEach((line) => {
                if (y + lineHeight > usableHeight) {
                    doc.addPage(); // Add a new page if the current page is full
                    y = marginTop; // Reset the y position for the new page
                }
                doc.text(line, 10, y);
                y += lineHeight; // Move to the next line
            });

            // Reset text color and font size for footer
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);

            // Add the page number at the bottom
            doc.text(`Page ${index + 1}`, 10, pageHeight - marginBottom);
        });

        doc.save('notes.pdf'); // Save the PDF
    };



    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode); // Toggle dark mode state
    };

    return (
        <div
            style={{
                padding: 20,
                maxWidth: 800,
                margin: 'auto',
                backgroundColor: isDarkMode ? '#333' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                transition: 'background-color 0.3s, color 0.3s',
            }}
        >
            <button 
                onClick={toggleDarkMode}
                style={{
                    padding: 10,
                    marginBottom: 20,
                    backgroundColor: isDarkMode ? '#555' : '#ddd',
                    color: isDarkMode ? '#fff' : '#000',
                    border: 'none',
                    cursor: 'pointer',
                }}
                id='dark-mode-toggle'> {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
            <h1>My Notepad</h1>
            <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Enter note"
                style={{
                    width: '100%',
                    padding: 10,
                    marginBottom: 20,
                    backgroundColor: isDarkMode ? '#555' : '#fff',
                    color: isDarkMode ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    
                }}
            />
            <div style={{ marginBottom: 20 }}>
                <label>Note Color:</label>
                <input type="color" value={noteColor} onChange={(e) => setNoteColor(e.target.value)} />
                <label style={{ marginLeft: 20 }}>Font Size:</label>
                <select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                </select>
            </div>
            <button onClick={addNote} style={{ padding: 10, marginRight: 10 }}>Add Note</button>
            <button onClick={generatePDF} style={{ padding: 10, marginRight: 10 }}>Generate PDF</button>
            <h2>Notes</h2>
            {notes.map((note, index) => (
                <div
                    key={index}
                    style={{
                        border: '1px solid #ccc',
                        padding: 10,
                        marginBottom: 10,
                        backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
                        color: isDarkMode ? '#fff' : '#000',
                    }}
                >
                    <h3>{note.heading}</h3>
                    <p style={{ color: note.color, fontSize: note.fontSize }}>{note.note}</p>
                    <button onClick={() => editNote(index)} style={{ padding: 5, marginRight: 5 }}>Edit</button>
                    <button onClick={() => deleteNote(index)} style={{ padding: 5, marginRight: 5 }}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default Note;