import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  try {
    // Convert FormData to JSON
    const jsonData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Simulate API call to login
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        ...prevState,
        errors: data.errors || "An error occurred during login",
      };
    }

    // Login successful - redirect will be handled outside try-catch
  } catch (error) {
    console.error("Login error:", error);

    return {
      ...prevState,
      errors:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }

  redirect("/login");
}
