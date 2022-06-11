// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

// GET /fragments/?expand=1
// https://github.com/humphd/cloud-computing-for-programmers-summer-2022/blob/main/assignments/README.md#441-get-fragmentsexpand1

export async function getExpandedFragments(user) {
  console.log("Requesting user expanded fragments...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user expanded fragments", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment/?expand=1", { err });
  }
}
// GET /fragments/:id
export async function getFragmentDataByID(user, id) {
  console.log("Requesting fragment metadata by id...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got fragment data", { data });
  } catch (err) {
    console.error("Unable to call POST /v1/fragments", { err });
  }
}

// POST /fragments
// https://github.com/humphd/cloud-computing-for-programmers-summer-2022/blob/main/assignments/README.md#43-post-fragments
export async function postFragment(user, type, fData) {
  console.log("Posting fragment...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(type),
      method: "POST",
      body: fData,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got fragment data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call POST /v1/fragment", { err });
  }
}
