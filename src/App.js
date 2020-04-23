import React from 'react';
import { Rnd } from "react-rnd";
import './App.css';


class Box extends React.Component {
  render() {
    return (
      <Rnd
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "solid 1px #ddd",
          background: "black",
          color: "white",
          opacity: "0.5"
        }}
        size={{ width: this.props.placement.width,  height: this.props.placement.height }}
        position={{ x: this.props.placement.x, y: this.props.placement.y }}
        onDragStop={(e, d) => { this.props.onUpdatePlacement({ x: d.x, y: d.y }) }}
        onResizeStop={(e, _, ref, __, position) => {
          this.props.onUpdatePlacement({
            width: parseInt(ref.style.width.replace("px", "")),
            height: parseInt(ref.style.height.replace("px", "")),
            ...position,
          });
        }}
      >
        {this.props.placement.x} {this.props.placement.y}
      </Rnd>
    );
}
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxes: []
    }
  }
  onUpdatePlacement(idx, new_placement) {
    this.state.boxes[idx] = Object.assign({}, this.state.boxes[idx], new_placement);
    this.setState({
      boxes: this.state.boxes
    });
  }
  renderAsUnicode() {
    const cells = [];
    for (var i=0; i<40; i++) {
      cells[i] = new Array(200);
      for (var j=0; j<200; j++) {
        cells[i][j] = " ";
      }
    }
    for (const box of this.state.boxes) {
      for (var i = 0; i * 10 < box.width; i++) {
        cells[Math.round(box.y / 10)][Math.round(box.x / 10) + i] = "-";
      }
      for (var i = 0; i * 10 < box.height; i++) {
        cells[Math.round(box.y / 10) + i][Math.round(box.x / 10)] = "|";
      }
      for (var i = 0; i * 10 < box.height; i++) {
        cells[Math.round(box.y / 10) + i][Math.round((box.x + box.width) / 10)] = "|";
      }
      for (var i = 0; i * 10 < box.width; i++) {
        cells[Math.round((box.y + box.height) / 10)][Math.round(box.x / 10) + i] = "-";
      }

    }
    var ret = "";
    for (const row of cells) {
      ret += row.join('');
      ret += "\n";
    }
    return ret;
  }
  addButton() {
    const boxes = JSON.parse(JSON.stringify(this.state.boxes));
    boxes.push({ x: 0, y: 0, width: 320, height: 200 });
    this.setState({boxes});
  }
  render() {
    this.renderAsUnicode();
    return <div style={{border: "1px solid pink", height: "100vh", width: "100vw", display: "flex"}}>
      <button onClick={this.addButton.bind(this)}>
        add box
      </button>
      {this.state.boxes.map((box_placement, idx) => <Box placement={box_placement} onUpdatePlacement={this.onUpdatePlacement.bind(this, idx)}/>)}
      <pre>
      {this.renderAsUnicode()}
      </pre>
    </div>;
  }
} 

export default App;
