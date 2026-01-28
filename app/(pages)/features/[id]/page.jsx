// import { notFound } from "next/navigation";

// SSG:
// We have this function generateStaticParams(), in build time it gets executed by Next.js and returns
// an array of objects like this [{id: 1},{id: 2},...], this array tells Next.js How many static pages
// it's going to create by fetching the Api and creating these URLs and static pages.
// So if for some reason Next.js got a request for a static page with an id that's not returned by this
// function then we have two options:
// 1- first option is to serve up 404 page directly without trying to fetch the id, it's like Next.js
// just saying I do not have this:
// export const dynamicParams = false; // default value = true
// This option serves the global not-found.jsx

export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const features = await res.json();

  return features.map((obj) => ({
    id: obj.id.toString(),
  }));
}

async function getFeature(id) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/" + id);

  // 2- Second option which is more comprehensive is to try to fetch the id first and serve 404
  // only if not found really, because maybe Next.js has this id returned by generateStaticParams
  // but for some reason this id got deleted from the API so we need to check if we have a valid
  //  response or not even if we have this id returned by the generateStaticParams function, this
  //  is helpful only if you revalidate the cache, like if you use cache and you want static pages
  // but you also want to revalidate these pages after some time, otherwise if you do not use cache
  // at all then this is dynamic rendering and not static rendering so no need for generateStaticParams
  // function at all:

  // if (!res.ok) {
  //   notFound(); // This option serves the local not-found.jsx
  // }

  // OR you can return a specific 404 msg here because: 1- not-found.jsx does not receive params!
  // 2- You can't send props or id like this: notFound(id) it's not gonna work! so the only option:
  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function Feature({ params }) {
  const { id } = await params;
  const feature = await getFeature(id);

  // Specific 404 inside page inside the general [id] route page:
  if (!feature) {
    return (
      <main className="main feature">
        <section className="container">
          <h1 className="sr-only">Shortly feature detail here</h1>
          <h2 className="title">Sorry we couldn't find the feature with the id: {id}</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="main feature">
      <section className="container">
        <h1 className="sr-only">Shortly feature detail here</h1>
        <h2 className="title">You wanted to see the feature with the id: {feature.id}</h2>
        <div className="features-wrapper">
          <h3 className="feature-title">Username is - {feature.username}</h3>
        </div>
      </section>
    </main>
  );
}

export default Feature;
