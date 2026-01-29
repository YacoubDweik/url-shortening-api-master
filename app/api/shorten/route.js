export async function POST(req) {
  try {
    const { url } = await req.json();

    const res = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url }),
    });

    if (!res.ok) {
      return new Response("Failed to shorten URL", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}
