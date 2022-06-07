import React from 'react';
import makeCancelable from '../../../utils/helpers/makeCancelableAsync';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...rest }): JSX.Element | null => {
    const ImportedIconRef = React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading(true);
        const importIcon = async (): Promise<void> => {
            try {
                ImportedIconRef.current = (await import(`./icons/${name}.svg`)).ReactComponent;
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        const cancelableIconImport = makeCancelable(new Promise(importIcon));
        cancelableIconImport.promise;
        return () => {
            cancelableIconImport.cancel();
        };
    }, [name]);

    if (!loading && ImportedIconRef.current) {
        const { current: ImportedIcon } = ImportedIconRef;
        return <ImportedIcon {...rest} />;
    }

    return null;
};

export default Icon;
