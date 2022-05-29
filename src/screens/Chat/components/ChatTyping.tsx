import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../common/components/Button';
import Icon from '../../../common/components/Icon';

const ChatTyping: React.FC<{ onSend: (content: string) => void }> = ({ onSend }) => {
    const formik = useFormik({
        initialValues: {
            content: '',
        },
        validationSchema: Yup.object({
            content: Yup.string().required(),
        }),
        onSubmit: (values, { resetForm }) => {
            onSend(values.content);
            resetForm();
        },
    });
    return (
        <>
            <div className="chat-attachment">
                <Button className="chat-image-attach" variant="text" title="Gửi ảnh">
                    <Icon name="photo" />
                </Button>
                <Button variant="text" title="Gửi tập tin">
                    <Icon name="file-plus" />
                </Button>
            </div>
            <form className="chat-typing-container" onSubmit={formik.handleSubmit}>
                <input
                    id="content"
                    name="content"
                    className="chat-input-text"
                    placeholder="Nhập tin nhắn..."
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                />
                <>
                    <Button
                        type="submit"
                        className="chat-send-button"
                        variant="text"
                        title="Gửi tin nhắn">
                        <Icon name="send" />
                    </Button>
                </>
            </form>
        </>
    );
};

export default ChatTyping;
