import { useEffect, useState, useMemo } from 'react'
import { formatCurrency } from "./utils/formatCurrency"
import './App.css'
import ChartWrapper from './ChartWrapper'

function App() {
  const [frequencyWeeks, setFrequencyWeeks] = useState(1)
  const [borrowed, setBorrowed] = useState(0)
  const [rate, setRate] = useState(0)
  const [loanLength, setLoanLength] = useState(0)
  const [frequencyDue, setFrequencyDue] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalDue, setTotalDue] = useState(0)
  const [show, setShow] = useState(false);
  const [percentBorrowed, setPercentBorrowed] = useState(0);
  const [percentInterest, setPercentInterest] = useState(0);

  // Memoize loan calculation to prevent unnecessary re-renders
  const loanData = useMemo(() => {
    if (!borrowed || !rate || !loanLength) {
      return { totalPayment: 0, finalInterest: 0, frequencyPayment: 0 };
    }

    const monthlyInterestRate = rate / 12 / 100;
    const numberOfPayments = loanLength * 12;

    // Calculate monthly payment using loan formula
    const monthlyPayment =
      (borrowed * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const weeklyPayment = monthlyPayment / 4;
    const totalPayment = Math.round(monthlyPayment * numberOfPayments);
    const finalInterest = Math.round(totalPayment - borrowed);

    // Determine payment frequency amount
    const frequencyPayment = Math.round(weeklyPayment * (frequencyWeeks / 1));

    return { totalPayment, finalInterest, frequencyPayment };
  }, [borrowed, rate, loanLength, frequencyWeeks]);

  // Update state when loanData changes
  useEffect(() => {
    if (borrowed && rate && loanLength) {
      setShow(true);
      setTotalDue(loanData.totalPayment);
      setTotalInterest(loanData.finalInterest);
      setFrequencyDue(loanData.frequencyPayment);
      setPercentInterest(Math.round((loanData.finalInterest / loanData.totalPayment) * 100));
      setPercentBorrowed(Math.round((borrowed / loanData.totalPayment) * 100));
    } else {
      setShow(false);
      setTotalDue(0);
      setTotalInterest(0);
      setFrequencyDue(0);
      setPercentInterest(0);
      setPercentBorrowed(0);
    }
  }, [loanData]);

  return (
    <>
      <header>
        <h1>Loan Repayments Calculator</h1>
      </header>

      <main>      
        <div className='container'>
          <div className='calculator'>
            <div className='input-wrap'>
              <label htmlFor='borrow'>Amount to Borrow:</label>
              <span>$</span>
              <input name='borrow' type='number' 
                onChange={(e) => setBorrowed(e.target.value)}/>
              </div>
            <div className='input-wrap'>
              <label htmlFor='rate'>Interest Rate:</label>
              <span>%</span>
              <input name='rate' type='number' 
                onChange={(e) => setRate(e.target.value)}/>
            </div>
            <div className='input-wrap'>
              <label htmlFor='length' >Length of Loan:</label>
              <span>years</span>
              <input name='length' type='number' 
                onChange={(e) => setLoanLength(Math.round(e.target.value))}/>
            </div>
          </div>
        </div>

        {show ? 
          <div className='info-wrap'>
            <div className='results'>
              <p className='smalltext'>Principal & Interest</p>
              <div className='result-main'><strong>Total Repayments:</strong>{formatCurrency(totalDue)}</div>
              <div className='result-text'><strong>Initial Borrowed:</strong>{formatCurrency(borrowed)}</div>
              <div className='result-text'><strong>Total Interest:</strong>{formatCurrency(totalInterest)}</div>
              <div className='result-text'>
                <label htmlFor='frequency'>Frequency:</label>
                <select className='freq' name='frequency' onChange={(e) => setFrequencyWeeks(e.target.value)}>
                  <option value='1'>Weekly</option>
                  <option value='2'>Fortnightly</option>
                  <option value='4'>Monthly</option>
                  <option value='13'>Quarterly</option>
                  <option value='52'>Yearly</option>
                </select>
                <div>Payment: {formatCurrency(frequencyDue)}</div>
              </div>
            </div>
            <ChartWrapper
              percent1={percentBorrowed} 
              percent2={percentInterest} 
            />
          </div>
        : null}
      </main>
    </>
  )
}

export default App
