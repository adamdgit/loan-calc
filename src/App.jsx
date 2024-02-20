import { useEffect, useState } from 'react'
import { PieChart, Pie, Legend, Cell } from 'recharts';
import './App.css'
import {roundNumber} from './utils/roundNumber'
import Errortip from "./components/Errortip"

function formatCurrency(amount) {
  // Convert the number to a string and split it into whole and decimal parts
  const parts = amount.toString().split('.');
  // Add commas to the whole part of the number
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Return the formatted currency string with the Australian dollar sign
  return '$' + parts.join('.');
}

function App() {
  const [frequencyWeeks, setFrequencyWeeks] = useState(1)
  const [borrowed, setBorrowed] = useState(0)
  const [rate, setRate] = useState(0)
  const [loanLength, setLoanLength] = useState(0)
  const [frequencyDue, setFrequencyDue] = useState(0)
  const [totalInterest, SetTotalInterest] = useState(0)
  const [totalDue, setTotalDue] = useState(0)

  const [borrowError, setBorrowError] = useState(false)
  const [interestError, setInterestError] = useState(false)
  const [loanError, setLoanError] = useState(false)

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
    if (!borrowed) setBorrowError(true)
    else setBorrowError(false)
    if (!rate) setInterestError(true)
    else setInterestError(false)
    if (!loanLength) setLoanError(true)
    else setLoanError(false)

    // Convert annual interest rate to monthly interest rate
    const monthlyInterestRate = rate / 12 / 100;

    // Convert loan term in years to total number of monthly payments
    const numberOfPayments = loanLength * 12;

    // Calculate the monthly payment using the provided formula
    const monthlyPayment = borrowed * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    let weeklyPayment = monthlyPayment / 4;
    let totalPayment = monthlyPayment * 12 * loanLength;
    let finalInterest = totalPayment - borrowed;

    switch (parseInt(frequencyWeeks)) {
      case 1: 
        setFrequencyDue(Math.round(weeklyPayment));
        break;
      case 2: 
        setFrequencyDue(Math.round(weeklyPayment * 2));
        break;
      case 4: 
        setFrequencyDue(Math.round(weeklyPayment * 4));
        break;
      case 13: 
        setFrequencyDue(Math.round(weeklyPayment * 13));
        break;
      case 52:
        setFrequencyDue(Math.round(weeklyPayment * 52));
        break;
    }

    setTotalDue(Math.round(totalPayment));
    SetTotalInterest(Math.round(finalInterest));
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
              <input style={borrowError ? {border: '1px solid red'} : {}} name='borrow' type='number' 
                onChange={(e) => {setBorrowed(e.target.value), setBorrowError(false)}}/>
              <Errortip error={borrowError}/>
            </div>
            <div className='input-wrap'>
              <label htmlFor='rate'>Interest Rate:</label>
              <input style={interestError ? {border: '1px solid red'} : {}} name='rate' type='number' 
                onChange={(e) => {setRate(e.target.value), setInterestError(false)}}/>
              <Errortip error={interestError}/>
            </div>
            <div className='input-wrap'>
              <label htmlFor='length' >Length of Loan: <span className='smalltext'>(years)</span></label>
              <input style={loanError ? {border: '1px solid red'} : {}} name='length' type='number' 
                onChange={(e) => {setLoanLength(Math.round(e.target.value)), setLoanError(false)}}/>
              <Errortip error={loanError}/>
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
          </div>
          <button className='calc-btn' onClick={() => calculateLoan()}>Calculate</button>
        </div>


      <div className='container'>
        <h3>Repayments for borrowing: {formatCurrency(borrowed)}</h3>
        <div className='results'>
          <p><b>Total Payment: </b>{formatCurrency(totalDue)}</p>
          <p><b>Total Interest: </b>{formatCurrency(totalInterest)}</p>
          <p>
            <b>
              {frequencyWeeks == 1 ? 'Weekly ' : frequencyWeeks == 2 ? 'Fortnightly ' 
              : frequencyWeeks == 4 ? 'Monthly ' : frequencyWeeks == 52 ? 'Yearly ' : 'Quarterly '} 
              Payment: 
            </b>
            {formatCurrency(frequencyDue)}
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
