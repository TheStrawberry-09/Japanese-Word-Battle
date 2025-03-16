import React, { useState } from "react";
import { app } from "../firebase";
import { getDatabase, ref, update } from "firebase/database";

function TermUploadForm() {
  const initialFormData = {
    ID: 1000000,
    forms: [["ヽ"]],
    spelling: "ヽ",
    tags: [
      {
        name: "unc",
        meaning: "repetition mark in katakana",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        // จัดกลุ่มข้อมูลตาม Spelling
        console.log(jsonData);
        const groupedData = {};
        var termBank = [];
        jsonData.forEach((row) => {
          const spelling = row[1];
          if (!groupedData[spelling]) {
            groupedData[spelling] = [];
          }
          groupedData[spelling].push(row);
        });
        for (const spelling in groupedData) {
          var formsSet = new Set();
          const rows = groupedData[spelling];
          const firstRow = rows[0]; // ใช้ข้อมูลจากแถวแรกของกลุ่ม
          if (firstRow[6] >= 1000000) {
            rows.map((row) => addForms(row[0]));
            termBank.push({
              ID: firstRow[6],
              forms: Array.from(formsSet),
              spelling: spelling,
              tags: rows.map((row) => ({
                name: row[2], // ใช้ข้อมูลจาก row[2] เป็น name
                meaning: meaningdata(row),
                form: row[0],
              })), // Dynamically add type property with extracted data
            });
            function meaningdata(row) {
              var extractedData = row[5];
              if (row[6] >= 100030) {
                //unc
                if (row[2].includes("unc")) {
                  //var extractedData = row[5][0].content[0].content.content;
                  extractedData = row[5];
                  var test = typeof row[5][0];
                  if (test === "object") {
                    if (row[5][0].content[0] !== undefined) {
                      extractedData = row[5][0].content[0].content.content;
                      if (row[5][0].content[0].content[0] !== undefined) {
                        extractedData = [];
                        for (var key in row[5][0].content[0].content) {
                          //extractedData += row[5][0].content[0].content[key].content
                          extractedData.splice(
                            key,
                            0,
                            row[5][0].content[0].content[key].content
                          );
                        }
                      }
                    } else if (
                      row[5][0].content.content.content !== undefined
                    ) {
                      extractedData = row[5][0].content.content.content;
                    }
                  }
                } else if (row[2].includes("n")) {
                  extractedData = row[5];
                  if (row[5][0].content !== undefined) {
                    //var extractedData = row[5][0].content[0].content.content
                    if (typeof row[5][0] == Array) {
                      if (row[5][0].content[0].content[0] !== undefined) {
                        extractedData = [];
                        for (key in row[5][0].content[0].content) {
                          //extractedData += row[5][0].content[0].content[key].content
                          extractedData.splice(
                            key,
                            0,
                            row[5][0].content[0].content[key].content
                          );
                        }
                      } else if (row[5][0].content[0].content !== undefined) {
                        extractedData = row[5][0].content[0].content.content;
                      }
                    } else if (typeof row[5] == Object) {
                      if (row[5][0].content.content.content !== undefined) {
                        extractedData = row[5][0].content.content.content;
                      }
                    }
                  }
                } else if (row[2].includes("forms")) {
                  if (row[5][0].content !== undefined) {
                    if (row[5][0].content.content[1] !== undefined) {
                      extractedData = [];
                      for (key in row[5][0].content.content[1].content) {
                        extractedData.splice(
                          key,
                          0,
                          row[5][0].content.content[1].content[key].content
                        );
                      }
                    }
                  }
                }
                if (typeof row[5] == Array) {
                  if (row[5][0].content[0].content !== undefined) {
                    extractedData = [];
                    for (key in row[5][0].content[0].content) {
                      extractedData.splice(
                        key,
                        0,
                        row[5][0].content[0].content[key].content
                      );
                    }
                  }
                } else if (row[5][0].content !== undefined) {
                  extractedData = row[5];
                  if (typeof row[5] == Array) {
                    if (row[5][0].content[0].content !== undefined) {
                      if (row[5][0].content[0].content.content !== undefined) {
                        extractedData = row[5][0].content[0].content.content;
                      } else {
                        extractedData = [];
                        for (key in row[5][0].content[0].content) {
                          extractedData.splice(
                            key,
                            0,
                            row[5][0].content[0].content[key].content
                          );
                        }
                      }
                    }
                  }
                }
                return extractedData;
              }
              return extractedData;
            }
          }
          //console.log(termBank)
          //console.log(cells)
        }
        function addForms(word) {
          formsSet.add(word);
        }
        console.log(jsonData);
        setFormData(jsonData);
        setErrorMessage(null); // Clear any previous errors
      } catch (error) {
        setErrorMessage("Error parsing JSON file. Please check the format.");
        setFormData(null); // Reset form data if invalid JSON
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData) {
      setErrorMessage("Please upload a valid JSON file.");
      return;
    }

    try {
      console.log(formData);
      await uploadDataToRealtimeDatabase(formData);
      setErrorMessage(null); // Clear any previous errors
      setFormData(null); // Reset form data after successful upload
    } catch (error) {
      console.error("Error uploading data:", error);
      setErrorMessage("Error uploading data. Please try again.");
    }
  };
  const handleSubmitTest = async (event) => {
    event.preventDefault();

    if (!formData) {
      setErrorMessage("Please upload a valid JSON file.");
      return;
    }

    try {
      console.log(formData);
      await uploadDataLevel(formData);
      setErrorMessage(null); // Clear any previous errors
      setFormData(null); // Reset form data after successful upload
    } catch (error) {
      console.error("Error uploading data:", error);
      setErrorMessage("Error uploading data. Please try again.");
    }
  };
  const handleSubmitStamp = async (event) => {
    event.preventDefault();
    if (!formData) {
      setErrorMessage("Please upload a valid JSON file.");
      return;
    }

    try {
      await uploadStamp();
      setErrorMessage(null); // Clear any previous errors
      setFormData(null); // Reset form data after successful upload
    } catch (error) {
      console.error("Error uploading data:", error);
      setErrorMessage("Error uploading data. Please try again.");
    }
  };

  async function uploadDataToRealtimeDatabase(allData) {
    const db = getDatabase(app); // Use getDatabase for Realtime Database

    try {
      for (const data of allData) {
        const term = data.Word;
        const termRef = ref(db, "term_bank/" + term); // Construct reference path

        // Create or update data with update() for flexibility
        await update(termRef, {
          word: data.Word,
          spelling: data.Spelling,
          meaning: data.Meaning,
        });

        console.log("Data updated for");
      }

      console.log("All data uploaded to Realtime Database");
    } catch (e) {
      console.error("Error updating data:", e);
      throw e; // Re-throw for further handling
    }
  }

  async function uploadDataLevel() {
    const shuffleArray = (array) => {
      return array
        .map((item) => ({ ...item, sort: Math.random() })) // Add random sort key
        .sort((a, b) => a.sort - b.sort) // Sort based on the random key
        .map(({ sort, ...item }) => item); // Remove the sort key
    };
    const db = getDatabase(app); // Use getDatabase for Realtime Database
    var allData = [
      {
        level: "level01",
        character: [
          {
            text: "あ, ア",
            answer: "a",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fa.mp3?alt=media&token=045559a0-b36a-48a5-be1c-f478d6f25f8a",
            options: shuffleArray([
              { id: 0, text: "a", isCorrect: true },
              { id: 1, text: "i", isCorrect: false },
              { id: 2, text: "u", isCorrect: false },
              { id: 3, text: "e", isCorrect: false },
              { id: 4, text: "o", isCorrect: false },
            ]),
          },
          {
            text: "い, イ",
            answer: "i",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
            options: shuffleArray([
              { id: 0, text: "a", isCorrect: false },
              { id: 1, text: "i", isCorrect: true },
              { id: 2, text: "u", isCorrect: false },
              { id: 3, text: "e", isCorrect: false },
              { id: 4, text: "o", isCorrect: false },
            ]),
          },
          {
            text: "う, ウ",
            answer: "u",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fu.mp3?alt=media&token=52e3860b-fa38-4578-9cac-cca49215665c",
            options: shuffleArray([
              { id: 0, text: "a", isCorrect: false },
              { id: 1, text: "i", isCorrect: false },
              { id: 2, text: "u", isCorrect: true },
              { id: 3, text: "e", isCorrect: false },
              { id: 4, text: "o", isCorrect: false },
            ]),
          },
          {
            text: "え, エ",
            answer: "e",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fe.mp3?alt=media&token=c08b9310-1fb4-419d-b106-9be1de8253bf",
            options: shuffleArray([
              { id: 0, text: "a", isCorrect: false },
              { id: 1, text: "i", isCorrect: false },
              { id: 2, text: "u", isCorrect: false },
              { id: 3, text: "e", isCorrect: true },
              { id: 4, text: "o", isCorrect: false },
            ]),
          },
          {
            text: "お, オ",
            answer: "o",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fo.mp3?alt=media&token=eef38813-bf98-4d9e-b191-7c7ea8788d1a",
            options: shuffleArray([
              { id: 0, text: "a", isCorrect: false },
              { id: 1, text: "i", isCorrect: false },
              { id: 2, text: "u", isCorrect: false },
              { id: 3, text: "e", isCorrect: false },
              { id: 4, text: "o", isCorrect: true },
            ]),
          },
        ],

        Missing_Word: [
          {
            text: "⬜き (eki)",
            answer: "え",
            story: "where is the train station?",
            meaning: "train station",
            options: shuffleArray([
              {
                id: 0,
                text: "え",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
              },
              {
                id: 1,
                text: "あ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
              },
              {
                id: 2,
                text: "い",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fi.mp3?alt=media&token=30971165-205f-4a38-abc6-a1651d61b510",
              },
              {
                id: 3,
                text: "お",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fo.mp3?alt=media&token=b6f96b6e-df47-4eee-90e6-af16637feb1d",
              },
            ]),
          },
          {
            text: "⬜りぐち (iriguchi)",
            answer: "い",
            story: "Which signs should I follow?",
            meaning: "entry gate",
            options: shuffleArray([
              {
                id: 0,
                text: "い",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fi.mp3?alt=media&token=30971165-205f-4a38-abc6-a1651d61b510",
              },
              {
                id: 1,
                text: "え",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
              },
              {
                id: 2,
                text: "あ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
              },
              {
                id: 3,
                text: "う",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fu.mp3?alt=media&token=6deaed67-7cb0-4702-8529-7f8154d3a14f",
              },
            ]),
          },
          {
            text: "⬜しあげまで(Oshiage)",
            answer: "お",
            story: "what name station i go?",
            meaning: "To Oshiage",
            options: shuffleArray([
              {
                id: 0,
                text: "お",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fo.mp3?alt=media&token=b6f96b6e-df47-4eee-90e6-af16637feb1d",
              },
              {
                id: 1,
                text: "え",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
              },
              {
                id: 2,
                text: "あ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
              },
              {
                id: 3,
                text: "う",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fu.mp3?alt=media&token=6deaed67-7cb0-4702-8529-7f8154d3a14f",
              },
            ]),
          },
          {
            text: "⬜くら (ikura)",
            answer: "い",
            story: "what word meaning 'how much'?",
            meaning: "how much",
            options: shuffleArray([
              {
                id: 0,
                text: "い",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fi.mp3?alt=media&token=30971165-205f-4a38-abc6-a1651d61b510",
              },
              {
                id: 1,
                text: "え",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
              },
              {
                id: 2,
                text: "あ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
              },
              {
                id: 3,
                text: "う",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fu.mp3?alt=media&token=6deaed67-7cb0-4702-8529-7f8154d3a14f",
              },
            ]),
          },
          {
            text: "ちゅう⬜⬜ぐち (Cyuuouguchi)",
            answer: "おう",
            story: "Which signs should I follow to exit?",
            meaning: "central exit",
            options: shuffleArray([
              {
                id: 0,
                text: "おう",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fou.mp3?alt=media&token=1118fa6c-1f32-459e-811b-adba88fe8d6c",
              },
              {
                id: 1,
                text: "おい",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Foi.mp3?alt=media&token=3556a55f-3c41-4eaa-a138-8d755b7b1bf6",
              },
              {
                id: 2,
                text: "あえ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fae.mp3?alt=media&token=1219015e-06cd-4373-ba8c-93a16fc3462a",
              },
              {
                id: 3,
                text: "あう",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fau.mp3?alt=media&token=efb0ed36-8af7-4ff1-b162-d3f4d1389365",
              },
            ]),
          },
          {
            text: "スカ⬜ツリー (sukaitsuri)",
            answer: "い",
            story: "What is Skytree in Japanese?",
            meaning: "Skytree",
            options: shuffleArray([
              {
                id: 0,
                text: "い",
                isCorrect: true,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fi.mp3?alt=media&token=30971165-205f-4a38-abc6-a1651d61b510",
              },
              {
                id: 1,
                text: "え",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
              },
              {
                id: 2,
                text: "あ",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
              },
              {
                id: 3,
                text: "う",
                isCorrect: false,
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fu.mp3?alt=media&token=6deaed67-7cb0-4702-8529-7f8154d3a14f",
              },
            ]),
          },
        ],
        Correct_Word: [
          {
            text: "えき",
            answer: "eki",
            story: "where is the train station?",
            meaning: "train station",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Feki.mp3?alt=media&token=4b9a86f4-be7c-4d4c-a5d1-7a3f15b914ca",
            options: shuffleArray([
              { id: 0, text: "eki", isCorrect: true },
              { id: 1, text: "aki", isCorrect: false },
              { id: 2, text: "ei", isCorrect: false },
              { id: 3, text: "ou", isCorrect: false },
            ]),
          },
          {
            text: "いりぐち",
            answer: "iriguchi",
            story: "Which signs should I follow?",
            meaning: "entry gate",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Firiguchi.mp3?alt=media&token=6f061a45-8e53-467d-9a31-89fa3f0c345f",
            options: shuffleArray([
              { id: 0, text: "iriguchi", isCorrect: true },
              { id: 1, text: "ariguchi", isCorrect: false },
              { id: 2, text: "origuchi", isCorrect: false },
              { id: 3, text: "uriguchi", isCorrect: false },
            ]),
          },
          {
            text: "おしあげ",
            answer: "Oshiage",
            story: "what name station i go?",
            meaning: "Oshiage",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
            options: shuffleArray([
              { id: 0, text: "Oshiage", isCorrect: true },
              { id: 1, text: "Ningyōchō", isCorrect: false },
              { id: 2, text: "ashiade", isCorrect: false },
              { id: 3, text: "ishiite", isCorrect: false },
            ]),
          },
          {
            text: "いくら",
            answer: "ikura",
            story: "what word meaning 'how much'?",
            meaning: "how much",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fikura.mp3?alt=media&token=580bfc51-d113-45d7-ab5c-5d89dce6a854",
            options: shuffleArray([
              { id: 0, text: "ikura", isCorrect: true },
              { id: 1, text: "arugu", isCorrect: false },
              { id: 2, text: "akura", isCorrect: false },
              { id: 3, text: "iruga", isCorrect: false },
            ]),
          },
          {
            text: "ちゅうおうぐち",
            answer: "Cyuuouguchi",
            story: "Which signs should I follow to exit?",
            meaning: "central exit",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fcyuuouguchi.mp3?alt=media&token=6bb4b782-240d-487d-b8ec-e7a0e500352f",
            options: shuffleArray([
              { id: 0, text: "Cyuuouguchi", isCorrect: true },
              { id: 1, text: "Chiguguchi", isCorrect: false },
              { id: 2, text: "kitaguchi", isCorrect: false },
              { id: 3, text: "minamiguchi", isCorrect: false },
            ]),
          },
          {
            text: "スカイツリー ",
            answer: "sukaitsuri",
            story: "What is Skytree in Japanese?",
            meaning: "Skytree",
            audio:
              "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fsukaitsuri.mp3?alt=media&token=fccd7059-c887-4c3b-a3c3-d25a2719ab24",
            options: shuffleArray([
              { id: 0, text: "sukaitsuri", isCorrect: true },
              { id: 1, text: "kusaisori", isCorrect: false },
              { id: 2, text: "asobini", isCorrect: false },
              { id: 3, text: "sokuisoru", isCorrect: false },
            ]),
          },
        ],
        Sentence: [
          {
            text: "ikuradesuka",
            story: "what word meaning 'how much'?",
            meaning: "how much",
            answer: "いくらですか",
            options: shuffleArray([
              {
                id: 0,
                text: "いくら",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fikura.mp3?alt=media&token=580bfc51-d113-45d7-ab5c-5d89dce6a854",
              },
              {
                id: 1,
                text: "ですか",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fdesuka.mp3?alt=media&token=e767ed0f-a6d9-423d-985c-a25ba8ac19a1",
              },
              {
                id: 2,
                text: "えき",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Feki.mp3?alt=media&token=4b9a86f4-be7c-4d4c-a5d1-7a3f15b914ca",
              },
            ]),
          },
        ],
        matching: {
          matchQuz: [
            {
              id: 1,
              text: "えき",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Feki.mp3?alt=media&token=4b9a86f4-be7c-4d4c-a5d1-7a3f15b914ca",
              type: "word",
              matched: false,
            },
            {
              id: 2,
              text: "いりぐち",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Firiguchi.mp3?alt=media&token=6f061a45-8e53-467d-9a31-89fa3f0c345f",
              type: "word",
              matched: false,
            },
            {
              id: 3,
              text: "おしあげ",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
              type: "word",
              matched: false,
            },
            {
              id: 4,
              text: "いくら",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fikura.mp3?alt=media&token=580bfc51-d113-45d7-ab5c-5d89dce6a854",
              type: "word",
              matched: false,
            },
            {
              id: 5,
              text: "ちゅうおうぐち",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fcyuuouguchi.mp3?alt=media&token=6bb4b782-240d-487d-b8ec-e7a0e500352f",
              type: "word",
              matched: false,
            },
            {
              id: 6,
              text: "スカイツリー",
              audio:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Fsukaitsuri.mp3?alt=media&token=fccd7059-c887-4c3b-a3c3-d25a2719ab24",
              type: "word",
              matched: false,
            },
          ],
          matchAns: [
            {
              id: 1,
              text: "Train station",
              type: "meaning",
              matched: false,
            },
            {
              id: 2,
              text: "Entry gate",
              type: "meaning",
              matched: false,
            },
            {
              id: 3,
              text: "Oshiage",
              type: "meaning",
              matched: false,
            },
            {
              id: 4,
              text: "How much",
              type: "meaning",
              matched: false,
            },
            {
              id: 5,
              text: "Central exit",
              type: "meaning",
              matched: false,
            },
            {
              id: 6,
              text: "Skytree",
              type: "meaning",
              matched: false,
            },
          ],
        },
        story_start:
          "Today I want to go to Tokyo Skytree by train. Tokyo Skytree is at Oshiage Station. Which way should I go?",
        story_end:
          "Yey, finally arrived at Tokyo Skytree. Let's take some pictures.",
        image_reward:
          "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTokyoSkytree.jpeg?alt=media&token=86ad3195-1ffa-4036-8475-226e3c7db790",
        progress: 19,
        word_get: [
          "えき",
          "いりぐち",
          "おしあげ",
          "いくら",
          "ちゅうおうぐち",
          "スカイツリー",
        ],
        user_stage: "1",
        learning_level: "あ-level",
      },
    ];
    var allData_test = [
      {
        act_1: {
          choose_path: {
            per_practice: {
              story_count: 1,
              story_image: {
                story_image_1:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FSign.png?alt=media&token=4d366332-5399-4cb9-9db5-225ec85e1665",
              },
              story_text: {
                story_text_1:
                  "“เจอป้ายแล้ว” คุณมองไปที่ป้ายแล้วพยามอ่านว่าป้ายไหนพาไปที่สถานีรถไฟ",
              },
            },
            post_practice: {
              correct_path: {
                story_count: 1,
                story_image: {
                  story_image_1:
                    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FSign.png?alt=media&token=4d366332-5399-4cb9-9db5-225ec85e1665",
                },
                story_text: {
                  story_text_1:
                    "“ทางนี้สินะ” คุณได้เดินไปตามทางที่ป้ายที่นำทางไปสถานีรถไฟบอก",
                },
              },
              game: {
                wantToGo: "Train Station",
                answer: "えき",
                options: [
                  {
                    audio: "",
                    id: 0,
                    image: "",
                    isCorrect: true,
                    text: "えき",
                  },
                  {
                    audio: "",
                    id: 1,
                    image: "",
                    isCorrect: false,
                    text: "バス",
                  },
                ],
                story_image_1: "",
                type: "sign",
              },
            },
          },
          practice: {
            pronunciation: [
              {
                answer: "e",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fe.mp3?alt=media&token=c08b9310-1fb4-419d-b106-9be1de8253bf",
                options: [
                  {
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                  {
                    id: 0,
                    isCorrect: true,
                    text: "e",
                  },
                ],
                text: "え",
              },
            ],
            word: [
              {
                answer: "E",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Feki.mp3?alt=media&token=4b9a86f4-be7c-4d4c-a5d1-7a3f15b914ca",
                meaning: "train station",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
                    id: 0,
                    isCorrect: true,
                    text: "E",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
                    id: 1,
                    isCorrect: false,
                    text: "A",
                  },
                ],
                text: "⬜ki",
              },
              {
                answer: "え",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Feki.mp3?alt=media&token=4b9a86f4-be7c-4d4c-a5d1-7a3f15b914ca",
                meaning: "train station",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fa.mp3?alt=media&token=276156ed-2f51-4787-832c-37492525020d",
                    id: 1,
                    isCorrect: false,
                    text: "あ",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/missing_word%2Fe.mp3?alt=media&token=f0bce1a2-ae62-4ea5-90cf-5f3e97f64b86",
                    id: 0,
                    isCorrect: true,
                    text: "え",
                  },
                ],
                text: "⬜き",
              },
            ],
          },
          story: {
            story_count: 6,
            story_image: {
              story_image_1:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FJapanCity.png?alt=media&token=1659dd0e-095b-4f41-b3d7-4f328ee068a9",
              story_image_2:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FJapan.png?alt=media&token=7a8212c2-3467-4ba3-9086-57c558f75307",
              story_image_3:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTokyoView.png?alt=media&token=097124a7-0561-41fc-b35a-7160713cccad",
              story_image_4:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTokyoSkytreeView.png?alt=media&token=d4ce04c2-5e4f-4600-8faa-3e770c4e9f81",
              story_image_5:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FJapanCityArt.png?alt=media&token=805e8354-fde2-4626-aaa9-432d4b7f89e0",
              story_image_6:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FJapanCityArt.png?alt=media&token=805e8354-fde2-4626-aaa9-432d4b7f89e0",
            },
            story_text: {
              story_text_1:
                "ในเช้าวันสดใส เป็นวันที่เหมาะสมกับเดินทางท่องเที่ยวเป็นอย่างมาก นี่เป็นโอกาศอันดีสำหรับคุณที่พึ่งเดินทางมาถึงประเทศญี่ปุ่น",
              story_text_2:
                "คุณมีความใฝ่ฝันมานานที่จะต้องการเดินทางท่องเที่ยวไปตามสถานที่ต่างในประเทศญี่ปุ่น",
              story_text_3:
                "วันนี้คุณจึงได้ทำตามแผนที่วางเอาไว้สำหรับการเดินทางไปยังสถานที่ท่องเที่ยวแห่งแรกของคุณ",
              story_text_4: "และที่เขาเลือกไปคือ tokyo skytree",
              story_text_5: "คุณกำลังเดินทางออกจากที่พักของคุณไปยังสถานีรถไฟ",
              story_text_6:
                "คุณจึงได้มองไปรอบ ๆ เพื่อหาป้ายที่บอกทางไปสถานีรถไฟ",
            },
          },
          nextAct: "act_2",
        },
        act_2: {
          choose_path: {
            per_practice: {
              story_count: 1,
              story_image: {
                story_image_1:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTicketMachine.png?alt=media&token=e6c12495-805c-41fd-b3d8-aa2f99983d7d",
              },
              story_text: {
                story_text_1:
                  "คุณได้พยายามอ่านภาษาญี่ปุ่นที่ปรากฏขึ้นมาเพื่อหาสถานี “Oshiage”",
              },
            },
            post_practice: {
              correct_path: {
                story_count: 1,
                story_image: {
                  story_image_1:
                    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTicketMachine.png?alt=media&token=e6c12495-805c-41fd-b3d8-aa2f99983d7d",
                },
                story_text: {
                  story_text_1: "คุณได้ตั๋วสำหรับขึ้นรถไฟแล้ว!",
                },
              },
              game: {
                wantToGo: "Oshiage",
                answer: "おしあげ",
                options: [
                  {
                    audio: "",
                    id: 0,
                    image: "",
                    isCorrect: true,
                    text: "おしあげ",
                  },
                  {
                    audio: "",
                    id: 1,
                    image: "",
                    isCorrect: false,
                    text: "あさくさ",
                  },
                ],
                story_image_1: "",
                type: "ticket",
              },
            },
          },
          practice: {
            pronunciation: [
              {
                answer: "o",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fo.mp3?alt=media&token=eef38813-bf98-4d9e-b191-7c7ea8788d1a",
                options: [
                  {
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                  {
                    id: 0,
                    isCorrect: true,
                    text: "o",
                  },
                ],
                text: "お",
              },
            ],
            word: [
              {
                answer: "O",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
                meaning: "oshiage",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fo.mp3?alt=media&token=eef38813-bf98-4d9e-b191-7c7ea8788d1a",
                    id: 0,
                    isCorrect: true,
                    text: "O",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "I",
                  },
                ],
                text: "⬜shiage",
              },
              {
                answer: "お",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
                meaning: "oshiage",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fo.mp3?alt=media&token=eef38813-bf98-4d9e-b191-7c7ea8788d1a",
                    id: 0,
                    isCorrect: true,
                    text: "お",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "い",
                  },
                ],
                text: "⬜しあげ",
              },
            ],
          },
          story: {
            story_count: 1,
            story_image: {
              story_image_1:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FStation.png?alt=media&token=2225a198-6f74-46ac-b296-0065abf064eb",
            },
            story_text: {
              story_text_1:
                "เมื่อคุณไปถึงสถานีรถไฟ ก็เดินไปที่ตู้ซื้อตั๋ว โดยสถานีปลายทางคือ “Oshiage”",
            },
          },
          nextAct: "act_3",
        },
        act_3: {
          choose_path: {
            per_practice: {
              story_count: 1,
              story_image: {
                story_image_1:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FStation.png?alt=media&token=2225a198-6f74-46ac-b296-0065abf064eb",
              },
              story_text: {
                story_text_1:
                  "คุณได้พยายามอ่านสถานีที่จะลงเมื่อไหร่จะเป็น สถานี “Oshiage”",
              },
            },
            post_practice: {
              correct_path: {
                story_count: 1,
                story_image: {
                  story_image_1:
                    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FStation.png?alt=media&token=2225a198-6f74-46ac-b296-0065abf064eb",
                },
                story_text: {
                  story_text_1: "คุณได้ลงที่สถานี “Oshiage” แล้ว",
                },
              },
              game: {
                wantToGo: "Oshiage",
                answer: "おしあげ",
                options: [
                  {
                    audio: "",
                    id: 0,
                    image: "",
                    isCorrect: true,
                    text: "おしあげ",
                  },
                  {
                    audio: "",
                    id: 1,
                    image: "",
                    isCorrect: false,
                    text: "あさくさ",
                  },
                ],
                story_image_1: "",
                type: "station",
              },
            },
          },
          practice: {
            pronunciation: [
              {
                answer: "a",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fa.mp3?alt=media&token=045559a0-b36a-48a5-be1c-f478d6f25f8a",
                options: [
                  {
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                  {
                    id: 0,
                    isCorrect: true,
                    text: "a",
                  },
                ],
                text: "あ",
              },
            ],
            word: [
              {
                answer: "a",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
                meaning: "oshiage",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fa.mp3?alt=media&token=045559a0-b36a-48a5-be1c-f478d6f25f8a",
                    id: 0,
                    isCorrect: true,
                    text: "a",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                ],
                text: "oshi⬜ge",
              },
              {
                answer: "あ",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Foshiage.mp3?alt=media&token=cb688f7b-1c6d-4460-9bfe-065d12901453",
                meaning: "oshiage",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fa.mp3?alt=media&token=045559a0-b36a-48a5-be1c-f478d6f25f8a",
                    id: 0,
                    isCorrect: true,
                    text: "あ",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "い",
                  },
                ],
                text: "おし⬜げ",
              },
            ],
          },
          story: {
            story_count: 1,
            story_image: {
              story_image_1:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FStation.png?alt=media&token=2225a198-6f74-46ac-b296-0065abf064eb",
            },
            story_text: {
              story_text_1:
                "เมื่อรถไฟเข้าถึงสถานี ก็ขึ้นรถไฟ และเดินทางจนถึงสถานี Oshiage",
            },
          },
          nextAct: "act_4",
        },
        act_4: {
          choose_path: {
            per_practice: {
              story_count: 1,
              story_image: {
                story_image_1:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FSign.png?alt=media&token=4d366332-5399-4cb9-9db5-225ec85e1665",
              },
              story_text: {
                story_text_1:
                  "คุณมองไปที่ป้ายแล้วพยามอ่านว่าป้ายไหนพาคุณไปที่ Tokyo Skytree",
              },
            },
            post_practice: {
              correct_path: {
                story_count: 2,
                story_image: {
                  story_image_1:
                    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTokyoSkytreeGate.png?alt=media&token=8582e91c-ee6f-4cf6-85d3-1c0e92ee9c6a",
                  story_image_2:
                    "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FTokyoSkytreeGate.png?alt=media&token=8582e91c-ee6f-4cf6-85d3-1c0e92ee9c6a",
                },
                story_text: {
                  story_text_1:
                    "เมื่อมาถึง Tokyo skytree และก็จ่ายเงินซื้อตั๋วเพิ่อเดินทางเข้าไปข้างใน",
                  story_text_2:
                    "เมื่อจ่ายเงินตั๋วค่าเข้าแล้ว ก็ถ่ายรูปเก็บเอาไว้เป็นที่ระลึก",
                },
              },
              game: {
                wantToGo: "Tokyo",
                answer: "とうきょう",
                options: [
                  {
                    audio: "",
                    id: 0,
                    image: "",
                    isCorrect: true,
                    text: "とうきょう",
                  },
                  {
                    audio: "",
                    id: 1,
                    image: "",
                    isCorrect: false,
                    text: "おしあげ",
                  },
                ],
                story_image_1: "",
                type: "ticket",
              },
            },
          },
          practice: {
            pronunciation: [
              {
                answer: "u",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fu.mp3?alt=media&token=52e3860b-fa38-4578-9cac-cca49215665c",
                options: [
                  {
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                  {
                    id: 0,
                    isCorrect: true,
                    text: "u",
                  },
                ],
                text: "u",
              },
            ],
            word: [
              {
                answer: "u",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Ftokyo.mp3?alt=media&token=a71de121-835e-480f-827f-1f0e6489b024",
                meaning: "Tokyo",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fu.mp3?alt=media&token=52e3860b-fa38-4578-9cac-cca49215665c",
                    id: 0,
                    isCorrect: true,
                    text: "u",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "i",
                  },
                ],
                text: "to⬜kyou",
              },
              {
                answer: "う",
                audio:
                  "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/audio%2Ftokyo.mp3?alt=media&token=a71de121-835e-480f-827f-1f0e6489b024",
                meaning: "Tokyo",
                options: [
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fu.mp3?alt=media&token=52e3860b-fa38-4578-9cac-cca49215665c",
                    id: 0,
                    isCorrect: true,
                    text: "う",
                  },
                  {
                    audio:
                      "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/character%2Fi.mp3?alt=media&token=61d787d8-d73c-403b-8945-d88aa26ec419",
                    id: 1,
                    isCorrect: false,
                    text: "い",
                  },
                ],
                text: "と⬜きょう",
              },
            ],
          },
          story: {
            story_count: 1,
            story_image: {
              story_image_1:
                "https://firebasestorage.googleapis.com/v0/b/japanese-word-battle.appspot.com/o/img%2FSign.png?alt=media&token=4d366332-5399-4cb9-9db5-225ec85e1665",
            },
            story_text: {
              story_text_1:
                "เมื่อลงจากรถไฟคุณก็ได้หาป้ายบอกทางไป Tokyo skytree",
            },
          },
          nextAct: "act_end",
        },
        act_count: 4,
        level: "level01_test",
        reward: {
          image: "",
          prime_stamp: "",
          stamp: "",
        },
      },
    ];
    try {
      for (const data of allData) {
        /*
        const term = data.level;
        const termRef = ref(db, "Game_Level/" + term); // Construct reference path

        // Create or update data with update() for flexibility
        await update(termRef, {
          Quizcharacter: data.character,
          QuizMissing_Word: data.Missing_Word,
          QuizCorrect_Word: data.Correct_Word,
          Quizmatching: data.matching,
          QuizSentence: data.Sentence,
          Story_start: data.story_start,
          Story_end: data.story_end,
          Image_reward: data.image_reward,
          Progress: data.progress,
          Word_get: data.word_get,
          User_stage:data.user_stage,
          Learning_level:data.learning_level
        });

        console.log("Data updated for");*/
      }
      for (const data of allData_test) {
        const term = data.level;
        const termRef = ref(db, "Game_Level/" + term); // Construct reference path

        // Create or update data with update() for flexibility
        await update(termRef, {
          level: data.level,
          act_1: data.act_1,
          act_2: data.act_2,
          act_3: data.act_3,
          act_4: data.act_4,
          reward: data.reward,
          act_count: data.act_count,
        });

        console.log("Data updated for");
      }
      console.log("All data uploaded to Realtime Database");
    } catch (e) {
      console.error("Error updating data:", e);
      throw e; // Re-throw for further handling
    }
  }
  async function uploadStamp() {
    const db = getDatabase(app); // Use getDatabase for Realtime Database
    var allData_Stamp = [
      {
        stage_1:{
          normal:"",
          trim:""
        },
        stage_2:{
          normal:"",
          trim:""
        },
      }
    ]
    try {
      for (const data of allData_Stamp) {
        const termRef = ref(db, "Stamp_Data"); // Construct reference path

        // Create or update data with update() for flexibility
        await update(termRef, {
          stage_1: data.stage_1,
          stage_2: data.stage_2,
        });

        console.log("Data updated for");
      }
      console.log("All data uploaded to Realtime Database");
    } catch (e) {
      console.error("Error updating data:", e);
      throw e; // Re-throw for further handling
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" id="jsonFileInput" onChange={handleFileChange} />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleSubmitTest}>
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleSubmitStamp}>
        <button type="submit">UploadStamp</button>
      </form>
    </div>
  );
}

export default TermUploadForm;
