/* eslint-disable */
import NumericLabel from 'react-pretty-numbers';


const NumberConverter = ({number}) => {    
    let params = {
        justification: 'L',
        locales : 'en-US',
        currency: true,
        precision: 2,
        commafy: true, 
        shortFormat: true,
        shortFormatMinValue: 1000000,
        title: false,
        cssClass: ['class1', 'class2']
      };
    return (
        number >= 0 ? <NumericLabel params={params}>{number}</NumericLabel> : <span>-<NumericLabel params={params}>{Math.abs(number)}</NumericLabel></span>
    );
}

export default NumberConverter;