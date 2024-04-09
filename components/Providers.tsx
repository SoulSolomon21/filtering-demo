"use client"

import React, {PropsWithChildren} from 'react';
import {QueryClientProvider,QueryClient} from "@tanstack/react-query";

const client = new QueryClient()

const Providers = ({children}:PropsWithChildren) => {
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};

export default Providers;