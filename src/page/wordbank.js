import { app } from "../firebase"; // Import your Firebase configuration
import React, { useState, useEffect } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
function WordBank() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const [inputValue, setInputValue] = useState(searchTerm);
  useEffect(() => {}, [searchTerm]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSearchTerm(inputValue);
    try {
      const databaseRef = ref(getDatabase(app), `term_bank/` + inputValue);
      onValue(databaseRef, (snapshot) => {
        const word = snapshot.val();
        console.log(word);
        setSearchResults(word);
      });
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };
  return (
    <div>
      <h1>search word</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <h1>output</h1>
      <div></div>
      {searchResults ? (
        <div>
          {(() => {
            // คำนวณ uniqueNames และ uniqueMeanings
            const uniqueNames = [
              ...new Set(
                searchResults.tag
                  .filter((tagItem) => tagItem.name !== "forms")
                  .map((tagItem) => tagItem.name)
              ),
            ];
            const uniqueMeanings = [
              ...new Set(
                searchResults.tag
                  .filter((tagItem) => tagItem.name !== "forms")
                  .flatMap((tagItem) => tagItem.meaning || [])
              ),
            ];

            return (
              <table border="1">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Spelling</th>
                    <th>Form</th>

                    <th>Name</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResults.ID}</td>
                    <td>{searchResults.spelling}</td>
                    <td>{searchResults.tag[0] && searchResults.tag[0].form}</td>

                    <td>
                      {uniqueNames.map((name, nameIndex) => (
                        <div key={nameIndex}>{name}</div>
                      ))}
                    </td>
                    <td>
                      {uniqueMeanings.map((meaning, meaningIndex) => (
                        <div key={meaningIndex}>{meaning}</div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })()}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default WordBank;
