import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Loader from "./Loader.jsx";
import { Volume2, ExternalLink } from "lucide-react";

const Dictionary = () => {
  const [word, setWord] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [antonyms, setAntonyms] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [examples, setExamples] = useState([]);
  const [sound, setSound] = useState([]);

  const baseUrl = `https://api.dictionaryapi.dev/api/v2/entries/en`;

  const fetchWord = async (searchWord) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/${searchWord}`);
      const result = await response.json();

      if (response.status === 404) {
        toast.error(result.title ? result.title : "No word found!", {
          style: {
            background: "#27272a ",
            border: "2px solid #49494e",
            color: "#fff", // Text color
          },
        });
        setWord([]);
      } else {
        setWord(result);

        // Getting word examples from the result
        const wordExamples = [];

        result.forEach((element) => {
          element.meanings.forEach((meaning) => {
            meaning.definitions.forEach((definition) => {
              if (definition.example) {
                wordExamples.push(definition.example);
              }
            });
          });
        });

        setExamples(wordExamples);
        // Getting audios from the result
        const wordAudio = [];

        result.forEach((element) => {
          element.phonetics.forEach((phonetic) => {
            if (phonetic.audio) {
              wordAudio.push(phonetic.audio);
            }
          });
        });

        setSound(wordAudio.find((audio) => audio !== "") || "");
        console.log(wordAudio);

        // Getting the antonyms and synonyms from the result
        const antonymsArray = [];
        const synonymsArray = [];

        result.forEach((element) => {
          element.meanings.forEach((meaning) => {
            antonymsArray.push(...meaning.antonyms);
            synonymsArray.push(...meaning.synonyms);
          });
        });

        setAntonyms(antonymsArray);
        setSynonyms(synonymsArray);

        console.log(result);
      }
    } catch (error) {
      toast.error(error.message, {
        style: {
          background: "#27272a ",
          border: "2px solid #49494e",
          color: "#fff", // Text color
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = () => {
    if (inputWord === "") {
      toast("Please enter a word!", {
        style: {
          background: "#27272a ",
          border: "2px solid #49494e",
          color: "#fff", // Text color
        },
      });
      return;
    }
    setInputWord("");
    fetchWord(inputWord);
  };

  const handleVoice = (voice) => {
    if (voice === "") {
      toast("Sound not available", {
        style: {
          background: "#27272a ",
          border: "2px solid #49494e",
          color: "#fff",
        },
      });
      return;
    }
    const audio = new Audio(voice);
    audio.play();
  };

  return (
    <section className="my-10 px-5">
      <Toaster />
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Enter a word"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchWord(inputWord);
            }
          }}
          onChange={(ev) => setInputWord(ev.target.value)}
          className="w-full px-6 py-3 bg-transparent my-5 rounded-full border border-zinc-700 text-zinc-700- outline-none text-xl"
        />
        <button
          onClick={handleInput}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-5 py-[15px] bg-zinc-800 text-white rounded-e-3xl"
        >
          Search
        </button>
      </div>

      <div className="my-5 mx-5">
        {isLoading ? (
          <div className="flex justify-center items-center text-center">
            <Loader />
          </div>
        ) : (
          <>
            {word.length === 0 && (
              <p className="text-xl text-center my-10 text-zinc-900">
                Enter any word
              </p>
            )}
            {word.map((item, index) => (
              <div key={index}>
                {index === 0 && (
                  <>
                    <div className="flex items-center text-zinc-900 font-medium text-left lg:text-3xl">
                      <div
                        key={index}
                        onClick={() => handleVoice(sound)}
                        className="cursor-pointer bg-zinc-800 mx-3 rounded-full p-2 text-white"
                      >
                        <Volume2 />
                      </div>
                      <div>
                        <span className="text-lg">{item.word}</span>
                        <div className="text-sm text-zinc-600">
                          {item?.phonetics.map((phonetic, index) => (
                            <span key={index}>{phonetic.text}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <h1 className="text-left my-5 text-xl text-zinc-800 font-medium">
                      Meaning
                    </h1>
                    <div className="my-3">
                      <div className="font-medium">
                        <ol>
                          {item.meanings.map((meaning, index) => (
                            <li key={index} className="list-inside my-5">
                              <span className="text-zinc-600">
                                {meaning.partOfSpeech}
                              </span>
                              <ul className="my-2">
                                {meaning.definitions
                                  .slice(0, 3)
                                  .map((definition, index) => (
                                    <li
                                      key={index}
                                      className="text-zinc-800 ml-3 list-inside list-decimal"
                                    >
                                      {definition.definition}
                                    </li>
                                  ))}
                              </ul>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="my-10">
                        <h1 className="text-left my-5 text-xl text-zinc-800 font-medium">
                          Examples
                        </h1>
                        {examples.map((example, index) => (
                          <li
                            key={index}
                            className="list-inside  list-decimal ml-5 text-zinc-600 font-medium"
                          >
                            {example}
                          </li>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center lg:flex-row flex-col ">
                      <div className="px-5 w-full">
                        <div className="my-10 px-5 rounded bg-zinc-100 p-3">
                          <h1 className="text-zinc-800 my-3 font-bold text-xl">
                            Antonyms
                          </h1>
                          <div className="flex flex-col gap-3">
                            {antonyms.slice(0, 5).map((ele, index) => (
                              <p
                                key={index}
                                className="rounded-md bg-zinc-200 px-3 py-2 text-zinc-900 text-xl font-medium"
                              >
                                {ele}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className=" px-5 w-full">
                        <div className="my-10 px-5 rounded bg-zinc-100 p-3">
                          <h1 className="text-zinc-800 my-3 font-bold text-xl">
                            Synonyms
                          </h1>
                          <div className="flex flex-col gap-3">
                            {synonyms.slice(0, 5).map((ele, index) => (
                              <p
                                key={index}
                                className="rounded-md bg-zinc-200 px-4 py-2 text-zinc-900 text-xl font-medium"
                              >
                                {ele}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {index === 0 && (
                  <div className="my-10 flex lg:flex-row flex-col justify-center items-center text-center gap-3">
                    <span className="font-semibold">source:</span>
                    <a
                      target="_blank"
                      className="flex justify-center items-center text-center gap-2 "
                      href={item.sourceUrls[0]}
                    >
                      {item.sourceUrls[0]} <ExternalLink />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Dictionary;
