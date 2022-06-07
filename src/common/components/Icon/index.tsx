import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...rest }): JSX.Element | null => {
    const ImportedIconRef = React.useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
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
        if (mounted.current === true) {
            importIcon();
        }
        return () => {
            mounted.current = false;
        };
    }, [name]);

    if (!loading && ImportedIconRef.current) {
        const { current: ImportedIcon } = ImportedIconRef;
        return <ImportedIcon {...rest} />;
    }

    return null;
};

export default Icon;
