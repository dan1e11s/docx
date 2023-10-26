import { useState } from 'react';

const urlAddReplacement = 'https://docx-server.onrender.com/add-replacement';
const urlApplyReplacements =
  'https://docx-server.onrender.com/apply-replacements';

function App() {
  const [file, setFile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [replacement, setReplacement] = useState('');
  const [replacements, setReplacements] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleReplacementChange = (e) => {
    setReplacement(e.target.value);
  };

  const handleAddReplacement = () => {
    if (!file) {
      alert('Выберите файл!');
      return;
    }

    if (keyword && replacement) {
      fetch(urlAddReplacement, {
        method: 'POST',
        body: JSON.stringify({ keyword, replacement }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          setReplacements([...replacements, { keyword, replacement }]);
          setKeyword('');
          setReplacement('');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleApplyReplacements = () => {
    const formData = new FormData();
    formData.append('file', file);

    formData.append('replacements', JSON.stringify(replacements));

    fetch(urlApplyReplacements, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'новый-документ.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={handleKeywordChange}
      />
      <input
        type="text"
        placeholder="Replacement"
        value={replacement}
        onChange={handleReplacementChange}
      />
      <button onClick={handleAddReplacement}>Add Replacement</button>
      <button onClick={handleApplyReplacements}>Apply Replacements</button>
      <ul>
        {replacements.map((rep, index) => (
          <li key={index}>
            Keyword: {rep.keyword}, Replacement: {rep.replacement}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
