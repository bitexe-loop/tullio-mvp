import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useRef, useState } from "react";

function App() {
  const searchFieldRef = useRef<HTMLInputElement | null>(null);
  const [answer, setAnswer] = useState("");

  const handleSearch = async () => {
    if (searchFieldRef.current) {
      const search = searchFieldRef.current.value;
      const result = await fetch(
        `http://localhost:3001/question`,
        {
          method: "POST",
          body: JSON.stringify({ question: search })
        }
      );

      const { answer, sources } = await result.json();
      setAnswer(answer);
    }
  }

  return (
    <Stack justifyContent="center" alignItems="center" pt="20vh">
      <Typography variant="h1" fontWeight={900}>TULLIO</Typography>
      <Stack direction="row" width={{ xs: "80%", lg: "50%" }} spacing={1}>
        <TextField ref={searchFieldRef} variant="outlined" placeholder="Search" sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={handleSearch}
        >Search</Button>
      </Stack>
      {answer && <Typography variant="h2">{answer}</Typography>}
    </Stack>
  );
}

export default App;
