import React from 'react';
import Button from './common/components/Button';
import InputText from './common/components/InputText';

const App = () => {
    return (
        <div>
            <Button disabled>hello</Button>
            <InputText placeholder="hello..." className="m-3" />
        </div>
    );
};

export default App;
