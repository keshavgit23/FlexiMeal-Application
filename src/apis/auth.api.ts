const API_URL = import.meta.env.VITE_API_URL;

export const authenticateUser = async (token: string) => {
  const response = await fetch(
    `${API_URL}/api/v1/auth/authenticate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Token received:", !!token);
  console.log("Calling backend:", `${API_URL}/api/v1/auth/authenticate`);

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
};