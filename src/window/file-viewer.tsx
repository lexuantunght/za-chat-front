import React from 'react';
import ReactDOM from 'react-dom';
import FileViewer from '../presentation/FileViewer';
import '../utils/multilingual/i18n';

ReactDOM.render(
    <React.StrictMode>
        <FileViewer />
    </React.StrictMode>,
    document.getElementById('root')
);
