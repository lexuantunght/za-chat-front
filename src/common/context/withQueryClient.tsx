import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true
        }
    }
});

function withQueryClient<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
        <QueryClientProvider client={queryClient}>
            <Component {...props} />
        </QueryClientProvider>
    );
}

export default withQueryClient;
