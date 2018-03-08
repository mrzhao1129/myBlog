class Father extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberArray: [0, 1, 2]
      // numberArray: [
      //   { number: 0 },
      //   { number: 1 },
      //   { number: 2 },
      // ]
      // numberArray: Immutable.fromJS([
      //   { number: 0 },
      //   { number: 1 },
      //   { number: 2 },
      // ])
    }
  }
  handleClick = index => {
    let preNumberArray = this.state.numberArray;
    // -----简单state-----
    preNumberArray[index]++;
    // -----methed1-引用类型会存在一些问题-----
    // preNumberArray[index].number += 1;
    // -----methed2-利用ES6 Objece.assign()-----
    // preNumberArray[index] = Object.assign({}, preNumberArray[index]);
    // preNumberArray[index].number++;
    // -----methed3-利用Facebook immutable-----
    // let newNumber = preNumberArray.get(index).get('number')  + 1;
    // preNumberArray = preNumberArray.set(index, Immutable.fromJS({number: newNumber}));
    this.setState({
      numberArray: preNumberArray
    })
  }
  render() {
    return (
      <div style={{margin: 30}}>{
        this.state.numberArray.map((v, i) => {
          return <Son key={i} index={i} number={v} handleClick={this.handleClick} />
        })
      }</div>
    );
  }
} 