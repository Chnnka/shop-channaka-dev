import React, { createContext, useContext } from 'react';

export interface PrototypeSettings {
  simulatePaymentFailure: boolean;
  transparentHomeHeader: boolean;
}

const PrototypeContext = createContext<PrototypeSettings>({
  simulatePaymentFailure: false,
  transparentHomeHeader: true
});

export function PrototypeProvider({ value, children }: {value: PrototypeSettings;children: React.ReactNode;}) {
  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeSettings {
  return useContext(PrototypeContext);
}