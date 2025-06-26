import React, { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CalculatorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: 'auto',
  maxWidth: 400,
  backgroundColor: '#f5f5f5',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

const Display = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2),
  borderRadius: 5,
  marginBottom: theme.spacing(2),
  textAlign: 'right',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const CalculatorButton = styled(Button)(({ theme, operation }) => ({
  height: 60,
  fontSize: 18,
  backgroundColor: operation ? '#ff9500' : '#e0e0e0',
  color: operation ? '#fff' : '#333',
  '&:hover': {
    backgroundColor: operation ? '#e08600' : '#d0d0d0',
  },
}));

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const handleNumberClick = (value) => {
    if (display === '0' && value === '0') return;
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
    setWaitingForSecondValue(false);
  };

  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setWaitingForSecondValue(true);
    setDisplay('0');
  };

  const calculateResult = () => {
    if (!previousValue || !operation) return;

    const currentValue = parseFloat(display);
    let result = 0;

    if (operation === '+') {
      result = previousValue + currentValue;
    } else if (operation === '-') {
      result = previousValue - currentValue;
    } else if (operation === '*') {
      result = previousValue * currentValue;
    } else if (operation === '/') {
      if (currentValue === 0) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForSecondValue(false);
        return;
      }
      result = previousValue / currentValue;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForSecondValue(false);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', 'C', '+',
    '='
  ];

  return (
    <CalculatorContainer elevation={3}>
      <Display>
        <Typography variant="h4" component="div">
          {display}
        </Typography>
      </Display>
      <Grid container spacing={1}>
        {buttons.map((btn) => (
          <Grid item xs={3} key={btn}>
            <CalculatorButton
              fullWidth
              variant="contained"
              operation={['+', '-', '*', '/'].includes(btn)}
              onClick={() => {
                if (btn === 'C') handleClear();
                else if (btn === '=') calculateResult();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                else handleNumberClick(btn);
              }}
            >
              {btn}
            </CalculatorButton>
          </Grid>
        ))}
      </Grid>
    </CalculatorContainer>
  );
};

export default Calculator;
