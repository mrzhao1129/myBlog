class Son extends React.PureComponent {
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps.number, this.props.number);
  //   if(nextProps.number.number === this.props.number.number) {
  //     return false;
  //   }
  //   // if(nextProps.number.get('number') === this.props.number.get('number')) {
  //   //   return false;
  //   // }
  //   return true;
  // }
  render() {
    const {index, number, handleClick} = this.props;
    console.log(number);
    return <h1 onClick={() => handleClick(index)}>{
      // number.get('number')
      // number.number
      number
    }</h1>
  }
}