"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Resources() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer); // Cleanup the timer if user leaves early
  }, [router]);

  const style = {
    padding: "2rem 0",
    color: "var(--red)",
  };
  return (
    <main className="main">
      <section className="container">
        <h2 style={style}>
          You are trying to go the Resources page OR the shortened link, unfortunately this Cleanuri website is not
          clean at all! It's dirty and it sends you to unsafe websites, so for now let's forget about it and stay safe
          everyone!
        </h2>
      </section>
    </main>
  );
}
