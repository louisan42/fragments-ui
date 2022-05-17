import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Fragments-UI</h1>
      </header>
      <div className="App-buttons">
        <button className="login-button">Login</button>
        <button className="signUp-button">Sign Up</button>
      </div>
    </div>
  );
}

export default App;
