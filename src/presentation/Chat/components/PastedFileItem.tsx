import React from 'react';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';
import Image from '../../../common/components/Image';
import { FileData } from '../../../domain/model/FileData';

type PastedFileItemProps = {
    file: FileData;
    onRemove?: () => void;
};

const PastedFileItem = ({ file, onRemove }: PastedFileItemProps) => {
    return (
        <div className="chat-pasted-file-item">
            <Image src={file.url} />
            <Button variant="text" className="chat-pasted-cancel" onClick={onRemove}>
                <Icon name="cancel" />
            </Button>
        </div>
    );
};

export default PastedFileItem;
