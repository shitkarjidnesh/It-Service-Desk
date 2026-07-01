import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("making call");
    fetch("/api/")
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>React App</h1>;
}

export default App;
