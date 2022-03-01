import logo from './logo.svg';
import map_image from './cropped.png';
import './App.css';

function Map(props) {
    function handle_click(e) {
        e.preventDefault();
        console.log('Click occurred ', e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
    return <img className="map" src={map_image} onClick={handle_click}/>;
}

function App() {
  return (
    <div className="App">
      <Map/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
