import { useState } from "react";
import { Card, Button, Input, CardBody } from "@chakra-ui/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Zalogowano pomyślnie
      console.log("Logged in:", data);
      // np. przekierowanie
      // router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-20 shadow-xl rounded-2xl p-6">
      <CardBody>
        <h2 className="text-2xl font-bold mb-4 text-center">Zaloguj się</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
