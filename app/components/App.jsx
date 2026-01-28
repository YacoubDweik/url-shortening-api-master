"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// URL validation
function isValidURL(url) {
  const regex = /^(https?:\/\/[a-zA-Z0-9.-]+(:\d+)?(\/[^\s?#]*)?)$/;
  return regex.test(url);
}

// Mask CleanUri link:
const maskLink = (link) => {
  const parts = link.split("/");
  const slug = parts.pop(); // Get "vPQ4gm"
  const baseUrl = parts.join("/"); // Get "https://cleanuri.com"

  // Keep the first 3 characters and add stars
  const maskedSlug = slug.slice(0, 3) + "***";

  return `${baseUrl}/${maskedSlug}`;
};

// API call
async function getLink(link) {
  try {
    const res = await fetch("https://corsproxy.io/?url=https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url: link }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    throw new Error(err.message || "Request failed");
  }
}

export default function App() {
  const inputRef = useRef(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved results from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shortenedLinks");
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  // Update localStorage ONLY if there are results & the results got changed
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem("shortenedLinks", JSON.stringify(results));
    }
  }, [results]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const link = inputRef.current.value.trim();

    if (!link) {
      setError("Please add a link!");
      return;
    }

    if (!isValidURL(link)) {
      setError("Invalid URL! Include protocol (http/https) and no query strings.");
      return;
    }

    // Prevent duplicates
    if (results.some((r) => r.original === link)) {
      setError("This link is already shortened!");
      return;
    }

    // Start generating animation
    setIsGenerating(true);

    try {
      // Artificial delay to simulate “realistic” generating
      await new Promise((res) => setTimeout(res, 2000));

      const data = await getLink(link);
      setResults((prev) => [...prev, { original: link, shortened: maskLink(data.result_url) }]);
      inputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy(url, index) {
    navigator.clipboard.writeText(url); // do not visit page
    setCopiedIndex(index);
  }

  function handleDelete(index) {
    setResults((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("results", JSON.stringify(updated));
      localStorage.setItem("shortenedLinks", JSON.stringify(updated));
      return updated;
    });
    copiedIndex == index ? setCopiedIndex(null) : 0;
  }

  return (
    <div className="app-wrapper">
      <form className="app-form" onSubmit={handleSubmit} id="app">
        <div className="input-wrapper">
          <input ref={inputRef} type="text" name="link" className="form-box" placeholder="Shorten a link here..." />
          <span className="error-msg">{error}</span>
        </div>
        <button type="submit" className={`form-submit ${isGenerating ? "loading" : ""}`} disabled={isGenerating}>
          {isGenerating ? "Generating" : "Shorten It!"}
        </button>
      </form>

      <div className="app-results">
        {results.map((item, index) => (
          <div className="result-box" key={item.shortened}>
            <div className="links-wrapper">
              <span className="original-link">{item.original}</span>
              <Link href="/resources" className="shorten-link">
                {item.shortened}
              </Link>
            </div>

            <div className="result-actions">
              <button
                className={`copy-btn ${copiedIndex === index ? "active" : ""}`}
                onClick={() => handleCopy(item.shortened, index)}>
                {copiedIndex === index ? "Copied!" : "Copy"}
              </button>

              <button className="delete-btn" onClick={() => handleDelete(index)} aria-label="Delete">
                <img src="/assets/delete.png" alt="" width={25} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
