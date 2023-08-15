import { useEffect, useState } from 'react'
import { PieChart, Pie, Legend, Cell } from 'recharts';
import './App.css'
import {roundNumber} from './utils/roundNumber'

function App() {
  const [frequencyWeeks, setFrequencyWeeks] = useState(1)
  const [borrowed, setBorrowed] = useState(0)
  const [rate, setRate] = useState(0)
  const [loanLength, setLoanLength] = useState(0)
  const [frequencyDue, setFrequencyDue] = useState(0)
  const [totalInterest, SetTotalInterest] = useState(0)
  const [totalDue, setTotalDue] = useState(0)

  const data = [
    { name: 'Borrowed', value: roundNumber((borrowed / totalDue) * 100, 3) },
    { name: 'Interest', value: roundNumber((totalInterest / totalDue) * 100, 3) }
  ];

  const COLORS = ['#3396e7', '#e31bbc'];

  // when user changes payment frequency, re-calculate payments
  useEffect(() => {
    if (rate === 0) return
    calculateLoan();
  }, [frequencyWeeks])

  function calculateLoan() {
    // P = a ÷ { [ (1 + r) n ] - 1 } ÷ [ r (1 + r) n]
    // P is your monthly payment
    // a is your principal amount
    // r is your interest rate (divided by 12 to get months or 52 for weeks)
    // n is the total number of months or weeks in the loan term

    // rate / 100 / months * borrowed / (rate / 100 / months) ** -number of monthly payments * months
    // ((6.5 / 100 / 12) * 200000) / (1 - ((1 + (6.5 / 100 / 12)) ^ (-30 * 12)))
    let loanDurationWeeks = 52 * loanLength;
    let weeklyLoanRate = rate / 52;

    let x = (weeklyLoanRate + 1) ** loanDurationWeeks -1;
    let y = (weeklyLoanRate + 1) ** loanDurationWeeks * weeklyLoanRate;
    let z = x / y;

    let weeklyPayment = borrowed / z;
    let totalPayment = weeklyPayment * loanDurationWeeks;
    let finalInterest = totalPayment - borrowed;

    switch (parseInt(frequencyWeeks)) {
      case 1: 
        setFrequencyDue(parseFloat(weeklyPayment).toFixed(2));
        break;
      case 2: 
        setFrequencyDue(parseFloat(weeklyPayment * 2).toFixed(2));
        break;
      case 4: 
        setFrequencyDue(parseFloat(weeklyPayment * 4).toFixed(2));
        break;
      case 13: 
        setFrequencyDue(parseFloat(weeklyPayment * 13).toFixed(2));
        break;
      case 52:
        setFrequencyDue(parseFloat(weeklyPayment * 52).toFixed(2));
        break;
    }

    setTotalDue(parseFloat(totalPayment).toFixed(2));
    SetTotalInterest(parseFloat(finalInterest).toFixed(2));
  }

  return (
    <>
      <header>
        <h1>Loan Repayments Calculator</h1>
      </header>

      <main>

        <div className='container'>
          <h2>Loan Details:</h2>
          <div className='calculator'>
            <div className='input-wrap'>
              <label htmlFor='borrow'>Amount Borrowed:</label>
              <input name='borrow' type='text' onChange={(e) => setBorrowed(e.target.value)}/>
            </div>
            <div className='input-wrap'>
              <label htmlFor='rate'>Interest Rate:</label>
              <input name='rate' type='text' onChange={(e) => setRate(parseInt(e.target.value) / 100)}/>
            </div>
            <div className='input-wrap'>
              <label htmlFor='frequency'>Payment Frequency:</label>
              <select name='length' onChange={(e) => setFrequencyWeeks(e.target.value)}>
                <option value='1'>Weekly</option>
                <option value='2'>Fortnightly</option>
                <option value='4'>Monthly</option>
                <option value='13'>Quarterly</option>
                <option value='52'>Yearly</option>
              </select>
            </div>
            <div className='input-wrap'>
              <label htmlFor='length' >Length of Loan: <span className='smalltext'>(years)</span></label>
              <input name='length' onChange={(e) => setLoanLength(Math.round(e.target.value))}/>
            </div>
          </div>
          <button className='calc-btn' onClick={() => calculateLoan()}>Calculate</button>
        </div>


      <div className='container'>
        <h3>Repayments:</h3>
        <div className='results'>
          <p><b>Total Payment:</b> ${totalDue}</p>
          <p><b>Total Interest:</b> ${totalInterest}</p>
          <p>
            <b>
            {frequencyWeeks == 1 ? 'Weekly ' : frequencyWeeks == 2 ? 'Fortnightly ' : frequencyWeeks == 4 ? 'Monthly ' : frequencyWeeks == 52 ? 'Yearly ' : 'Quarterly '} 
            Payment: </b>${frequencyDue}
          </p>
        </div>
        
        <PieChart width={300} height={250}>
          <Pie
            data={data}
            cx={150}
            cy={110}
            innerRadius={30}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="top" height={36}/>
        </PieChart>
      </div>

      </main>
    </>
  )
}

export default App
