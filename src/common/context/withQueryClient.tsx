import React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: 3,
        },
    },
});

function withQueryClient<P>(Component: React.ComponentType<P>) {
    // eslint-disable-next-line react/display-name
    return (props: P) => (
        <QueryClientProvider client={queryClient}>
            <Component {...props} />
        </QueryClientProvider>
    );
}

export default withQueryClient;
