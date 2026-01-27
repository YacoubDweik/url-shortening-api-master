import "./page.css";
import Link from "next/link";

async function getFeatures() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  // This is fetched on the server because this is SSR
  // Next Does 2 things for us:
  // 1- It does one fetch only for each API regardless where and how many times the same API URL was fetched.
  // 2- It caches the results to make things faster unless you disable this or give cached data expiry time.

  // const res = await fetch("https://jsonplaceholder.typicode.com/users", {
  //   next: {
  //     revalidate: 0, // use 0 to opt out of using cache - disable caching!
  //   },
  // });

  return res.json();
}

async function Features() {
  const features = await getFeatures();

  return (
    <main className="main features">
      <section className="container">
        <h2 className="title">We have these features:</h2>
        <div className="features-wrapper">
          {features.map(({ id, username }) => (
            <Link key={id} href={`/features/${id}`} className="feature-box">
              <h3 className="feature-title">{username}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Features;
