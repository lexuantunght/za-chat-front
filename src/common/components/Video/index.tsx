import React from 'react';
import moment from 'moment';
import ReactPlayer from 'react-player';
import Button from '../Button';
import Icon from '../Icon';
import computeMediaSize from '../../../utils/helpers/computeMediaSize';

interface VideoProps {
    className?: string;
    url?: string;
    autoPlay?: boolean;
    onLoad?: () => void;
    style?: React.CSSProperties;
    showControllers?: boolean;
    onClickExtend?: () => void;
    showExtendButton?: boolean;
    isNative?: boolean;
    originWidth?: number;
    originHeight?: number;
    maxHeight?: number;
    maxWidth?: number;
    isFileViewer?: boolean;
}

const Video = ({
    className,
    url,
    autoPlay,
    onLoad,
    onClickExtend,
    style,
    showControllers = true,
    showExtendButton = true,
    isNative,
    originWidth,
    originHeight,
    maxHeight,
    maxWidth,
    isFileViewer,
}: VideoProps) => {
    let videoRef: ReactPlayer | null;
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [isMute, setIsMute] = React.useState(true);
    const [isSeek, setIsSeek] = React.useState(false);
    const [playedValue, setPlayedValue] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [isReady, setIsReady] = React.useState(false);

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement;
        setIsSeek(false);
        videoRef?.seekTo(parseFloat(target.value));
    };

    const handleSeekMouseDown = () => {
        setIsSeek(true);
    };

    const handleClickExtend = () => {
        setIsPlaying(false);
        onClickExtend?.();
    };

    const size = React.useMemo(
        () => computeMediaSize(originHeight, originWidth, maxHeight, maxWidth),
        [maxWidth, maxHeight, originHeight, originWidth]
    );

    return (
        <div
            className={className ? `za-video ${className}` : 'za-video'}
            style={{
                ...style,
                height: isFileViewer ? '100%' : 'auto',
                width: size?.width,
                aspectRatio: `${size?.width}/${size?.height}`,
            }}>
            <ReactPlayer
                ref={(player) => {
                    videoRef = player;
                }}
                url={url}
                width="100%"
                height="100%"
                muted={isMute}
                playing={isPlaying}
                controls={isNative}
                onReady={() => {
                    setIsReady(true);
                    onLoad?.();
                }}
                onDuration={(duration) => setDuration(duration)}
                onEnded={() => {
                    setIsPlaying(false);
                }}
                onProgress={(e) => {
                    if (!isSeek) setPlayedValue(Math.floor(e.playedSeconds));
                }}
            />
            {isReady && !isNative && (
                <>
                    <Button
                        variant="text"
                        className={'za-video-play' + (isPlaying ? ' za-video-playing' : '')}
                        onClick={() => setIsPlaying(!isPlaying)}>
                        <div>
                            <Icon name={isPlaying ? 'player-pause' : 'player-play'} />
                        </div>
                    </Button>
                    {!showControllers && showExtendButton && (
                        <div className="za-video-extend">
                            <Button variant="text" onClick={handleClickExtend}>
                                <div>
                                    <Icon name="extend" />
                                </div>
                            </Button>
                        </div>
                    )}
                    {showControllers && (
                        <div className="za-video-controls">
                            <Button
                                variant="text"
                                className={
                                    'za-video-play-control' + (isPlaying ? ' za-video-playing' : '')
                                }
                                onClick={() => setIsPlaying(!isPlaying)}>
                                <div>
                                    <Icon name={isPlaying ? 'player-pause' : 'player-play'} />
                                </div>
                            </Button>
                            <input
                                type="range"
                                className="video-slider"
                                min={0}
                                max={Math.floor(duration)}
                                step={1}
                                value={playedValue}
                                onMouseDown={handleSeekMouseDown}
                                onMouseUp={handleSeekMouseUp}
                                onChange={(e) => {
                                    if (isSeek) setPlayedValue(+e.target.value);
                                }}
                            />
                            <span>
                                {moment
                                    .utc((Math.floor(duration) - playedValue) * 1000)
                                    .format('mm:ss')}
                            </span>
                            {showExtendButton && (
                                <Button variant="text" onClick={handleClickExtend}>
                                    <div>
                                        <Icon name="extend" />
                                    </div>
                                </Button>
                            )}
                            <Button
                                className="video-volume"
                                variant="text"
                                onClick={() => setIsMute(!isMute)}>
                                <div>
                                    <Icon name={isMute ? 'volume-off' : 'volume'} />
                                </div>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Video;
