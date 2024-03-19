import { cn } from '@/lib/utils';
import React from 'react';
import CurrencyInput from 'react-currency-input-field';

const BRLCurrencyInput = ({ value, onChange }) => {


  return (
      <CurrencyInput
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      )}
      placeholder='R$ '
      decimalsLimit={2}
      allowDecimals
      decimalSeparator=','
        prefix={`R$ `}
        value={value}
      />
  );
};

export default BRLCurrencyInput;
