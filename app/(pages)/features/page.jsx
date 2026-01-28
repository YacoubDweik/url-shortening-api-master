import { Suspense } from "react";
import Loading from "./loading";
import "./page.css";
import Link from "next/link";

async function getFeatures() {
  await new Promise((res) => setTimeout(res, 1000)); // Delay
  const res = await fetch("https://jsonplaceholder.typicode.com/users", { cache: "no-store" });
  // You can use { cache: "no-store" } or {next: {revalidate: 0}} to disable caching
  // and have fresh data on every request, this is called dynamic rendering, you
  // can disable caching and get fresh data always, or you can use revalidate to use cache
  // for a specific time that you set adn then refetch the data after this period of time.

  // Now this res is fetched and get rendered on the server because this is SSR
  // Next Does 2 things for us:
  // 1- It does one fetch only for each API regardless where and how many times the same API URL was fetched.
  // 2- It caches the results to make things faster unless you disable this or give revalidation (refetch) time.

  // const res = await fetch("https://jsonplaceholder.typicode.com/users", {
  //   next: {
  //     revalidate: 60,
  // refetch when you get the first request after 60sec and the second request will have the fresh data.
  //   },
  // });

  return res.json();
}

// You can't use suspense here inside this function because Next will await to fetch the data
// and then reach to that element so by that time the loading.jsx will be shown and then you got
// the data so you suspense here won't work never! You can see the example at the end of this file.
// To be able to use suspense you have to do this:
// 1. Move the fetching logic to a dedicated Child Component
async function FeatureList() {
  const features = await getFeatures();
  return (
    <div className="features-wrapper">
      {features.map(({ id, username }) => (
        <Link key={id} href={`/features/${id}`} className="feature-box">
          <h3 className="feature-title">{username}</h3>
        </Link>
      ))}
    </div>
  );
}

// 2. The Parent Component stays synchronous or handles the layout
export default function FeaturesPage() {
  return (
    <main className="main features">
      <section className="container">
        <h2 className="title">We have these features:</h2>
        {/* Now Suspense can wrap the component that actually waits */}
        <Suspense fallback={<Loading />}>
          <FeatureList />
        </Suspense>
      </section>
    </main>
  );
}

// Here suspense will never ever work! you will always get the loading.jsx:
async function Features() {
  const features = await getFeatures();

  return (
    <main className="main features">
      <section className="container">
        <h2 className="title">We have these features:</h2>
        <Suspense fallback={<Loading />}>
          <div className="features-wrapper">
            {features.map(({ id, username }) => (
              <Link key={id} href={`/features/${id}`} className="feature-box">
                <h3 className="feature-title">{username}</h3>
              </Link>
            ))}
          </div>
        </Suspense>
      </section>
    </main>
  );
}
