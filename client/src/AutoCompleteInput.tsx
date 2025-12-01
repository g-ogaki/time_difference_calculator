import { useEffect, useRef } from "react";
import { CitiesProp } from "./utils"
import Awesomplete from "awesomplete";
import "awesomplete/awesomplete.css";
import { useApp } from "./App";
import { useLocation } from "./Location";

const getApiUrl = (base: string, path: string, queryParams: string) => {
  return base.startsWith("http://localhost")
    ? `${base}/api/${path}?${queryParams}`
    : `${base}?path=${path}&${queryParams}`;
};

export default function AutoCompleteInput({ isHere }: { isHere: boolean }) {
  const URL = process.env.REACT_APP_API_URL || '';

  const awesompleteRef = useRef<Awesomplete | null>(null);
  const suggestionsRef = useRef<CitiesProp>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const { setHereLocation, setThereLocation } = useApp();
  const { setHereOffset, setThereOffset } = useLocation();

  function onInput(query: string) {
    debounceTimer.current && clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetch(getApiUrl(URL, "search", `query=${query}`))
        .then(response => response.json())
        .then(data => {
          suggestionsRef.current = data;
          awesompleteRef.current && (awesompleteRef.current.list = Object.keys(suggestionsRef.current));
        });
    }, 500);
  }

  function onComplete(city: string) {
    // location
    const location = suggestionsRef.current[city];
    (isHere ? setHereLocation : setThereLocation)(location);
    // offset
    fetch(getApiUrl(URL, "offset", `lat=${location["lat"]}&lng=${location["lng"]}`))
      .then(response => response.json())
      .then(data => (isHere ? setHereOffset : setThereOffset)(data));
  };

  useEffect(() => {
    if (!inputRef.current) return;
    const inputEl = inputRef.current;
    awesompleteRef.current = new Awesomplete(inputEl, {
      list: [],
      minChars: 2,
      autoFirst: true,
      filter: Awesomplete.FILTER_STARTSWITH,
    });

    const handleInput = () => { onInput(inputEl.value); };
    const handleSelectComplete = () => { onComplete(inputEl.value); };

    inputEl.addEventListener("input", handleInput);
    inputEl.addEventListener("awesomplete-selectcomplete", handleSelectComplete);

    return () => {
      inputEl.removeEventListener("input", handleInput);
      inputEl.removeEventListener("awesomplete-selectcomplete", handleSelectComplete);
      awesompleteRef.current?.destroy();
    };
  }, []);

  return <input type="text" ref={inputRef} className="awesomplete" />;
};
