import React, { Component } from 'react';
import BlockCell from './blockCell';
import './App.css';
import { SIZE } from './constants';
let removeDec;
class App extends Component {
  dimePos = [
    { r: Math.floor(Math.random() * SIZE), c: Math.floor(Math.random() * SIZE) }
  ];
  refItems = [];
  state = { gameOver: false, foundAllDiamond: false, score: SIZE * SIZE };
  componentWillMount() {
    while (this.dimePos.length < SIZE) {
      let r = Math.floor(Math.random() * SIZE);
      let c = Math.floor(Math.random() * SIZE);
      if (
        this.dimePos.findIndex(pos => pos.r === r && pos.c === c) ===
        -1
      ) {
        this.dimePos.push({ r, c });
      }
    }
  }
  _decrementCounter(row, col) {
    this.refItems.forEach(refItem => {
      if (refItem.row !== row && refItem.col !== col) {
        refItem.ref._resetCurrentTile();
      }
    });
    const dec = document.getElementById('decrease');
    dec.style = 'display:inline';
    clearTimeout(removeDec);
    removeDec = setTimeout(() => {
      dec.style = 'display:none';
    }, 500);
    this.setState({ score: this.state.score - 1 });
    if (this.state.score === 0) {
      this.setState({ gameOver: true });
      const prevScore = localStorage.getItem('highScore') || 0;
      if (prevScore < this.state.score)
        localStorage.setItem('highScore', this.state.score - 1);
    }
  }
  _removeRevealedDiamondFromSearchArray(row, col) {
    this.dimePos.splice(
      this.dimePos.findIndex(
        diamond => diamond.r === row && diamond.c === col
      ),
      1
    );
    if (this.dimePos.length === 0) {
      this.setState({ foundAllDiamond: true });
      const prevScore = localStorage.getItem('highScore') || 0;
      if (prevScore < this.state.score)
        localStorage.setItem('highScore', this.state.score - 1);
    }
  }
  _renderRowElements(row) {
    let rowElements = [];
    for (let i = 0; i < SIZE; i++) {
      rowElements.push(
        <p key={i + '' + row}>
          <BlockCell
            ref={ref => {
              if (this.refItems.length < SIZE * SIZE)
                this.refItems.push({ row: row, col: i, ref });
            }}
            row={row}
            col={i}
            diamondPositions={this.dimePos}
            removeDiamondFromArray={() =>
              this._removeRevealedDiamondFromSearchArray(row, i)
            }
            decrementCounter={() => this._decrementCounter(row, i)}
          />
        </p>
      );
    }
    return rowElements;
  }
  _renderRows() {
    let row = [];
    for (let i = 0; i < SIZE; i++) {
      row.push(<li key={i}>{this._renderRowElements(i)}</li>);
    }
    return row;
  }
  _renderBoard() {
    return (
      <div className="board-wrapper">
        <div className="table-board">
          <ul>{this._renderRows()}</ul>
        </div>
        <div className="score-board">
          <p className="score-text">
            Your highScore: {localStorage.getItem('highScore') || 0}
          </p>
          <p className="score-text">
            Diamonds Left: {this.dimePos.length}
          </p>
          <p className="score-text">Your score: {this.state.score}</p>
          <p
            hidden={true}
            id={'decrease'}
            className="score-text-score-decrement"
          >
            -1
          </p>
        </div>
      </div>
    );
  }
  _renderGameOver() {
    return (
      <div className="game-over-content">
        <span className="game-over-text">
          {this.state.gameOver
            ? `Game Over`
            : `Congratulations! You have found all the diamonds.`}
        </span>
        <p className="score-text-game-over">Your score: {this.state.score}</p>
        <p>Reload to Play again</p>
      </div>
    );
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="jumbotron">
            <h1 style={{ textAlign: 'center' }}>Bloomberg Diamond Sweeper</h1>
          </div>
        </div>
        <div className="container">
          {this.state.gameOver || this.state.foundAllDiamond
            ? this._renderGameOver()
            : this._renderBoard()}
        </div>
      </div>
    );
  }
}

export default App;
