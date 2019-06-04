const React = window.React;
// const useState = React.useState;

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       hello world: {count}
//       <button onClick={() => {setCount(count => count + 1)}}>click</button>
//     </div>
//   );
// }

class App extends React.Component {
  state = {
    count: 0,
  }

  setCount = () => {
    this.setState(({count}) => ({
      count: count + 1,
    }));
  }

  render() {
    console.log(this.state.count);
    return (
      <div>
        hello world: {this.state.count}
        <button onClick={this.setCount}>click</button>
      </div>
    );
  }
}

export default App;
