import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencyInput from '../CurrencyInput';

describe('<CurrencyInput/> decimals', () => {
  const onValueChangeSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow value with decimals if allowDecimals is true', () => {
    render(<CurrencyInput allowDecimals={true} prefix="£" onValueChange={onValueChangeSpy} />);
    userEvent.type(screen.getByRole('textbox'), '1,234.56');

    expect(onValueChangeSpy).toBeCalledWith('1234.56', undefined);

    expect(screen.getByRole('textbox')).toHaveValue('£1,234.56');
  });

  it('should disallow value with decimals if allowDecimals is false', () => {
    render(<CurrencyInput allowDecimals={false} prefix="£" onValueChange={onValueChangeSpy} />);
    userEvent.type(screen.getByRole('textbox'), '1,234.56');

    expect(onValueChangeSpy).toBeCalledWith('123456', undefined);

    expect(screen.getByRole('textbox')).toHaveValue('£123,456');
  });

  it('should limit decimals to decimalsLimit length', () => {
    render(<CurrencyInput decimalsLimit={3} prefix="£" onValueChange={onValueChangeSpy} />);
    userEvent.type(screen.getByRole('textbox'), '1,234.56789');

    expect(onValueChangeSpy).toBeCalledWith('1234.567', undefined);

    expect(screen.getByRole('textbox')).toHaveValue('£1,234.567');
  });

  it('should be disabled if disabled prop is true', () => {
    render(<CurrencyInput decimalsLimit={3} disabled={true} onValueChange={onValueChangeSpy} />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should handle starting with decimal separator', () => {
    render(<CurrencyInput prefix="$" onValueChange={onValueChangeSpy} />);

    expect(screen.getByRole('textbox')).toHaveValue('');

    userEvent.type(screen.getByRole('textbox'), '.');

    expect(screen.getByRole('textbox')).toHaveValue('.');
    expect(onValueChangeSpy).toBeCalledWith(undefined, undefined);

    userEvent.type(screen.getByRole('textbox'), '9');

    expect(screen.getByRole('textbox')).toHaveValue('$0.9');
    expect(onValueChangeSpy).toBeCalledWith('.9', undefined);
  });

  it('should handle starting with decimal separator that is non period', () => {
    render(
      <CurrencyInput
        intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
        onValueChange={onValueChangeSpy}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('');

    userEvent.type(screen.getByRole('textbox'), ',');

    expect(screen.getByRole('textbox')).toHaveValue(',');
    expect(onValueChangeSpy).toBeCalledWith(undefined, undefined);

    userEvent.type(screen.getByRole('textbox'), '9');

    expect(screen.getByRole('textbox')).toHaveValue('0,9\xa0€');
    expect(onValueChangeSpy).toBeCalledWith(',9', undefined);
  });
});
