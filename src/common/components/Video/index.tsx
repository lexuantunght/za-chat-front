import React from 'react';
import ReactPlayer from 'react-player';
import Button from '../Button';
import Icon from '../Icon';

interface VideoProps {
    className?: string;
    url?: string;
    autoPlay?: boolean;
}

const Video = ({ className, url, autoPlay }: VideoProps) => {
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

    return (
        <div className={className ? `za-video ${className}` : 'za-video'}>
            <ReactPlayer
                ref={(player) => {
                    videoRef = player;
                }}
                url={url}
                width="100%"
                muted={isMute}
                playing={isPlaying}
                onReady={() => setIsReady(true)}
                onDuration={(duration) => setDuration(duration)}
                onEnded={() => {
                    setIsPlaying(false);
                }}
                onProgress={(e) => {
                    if (!isSeek) setPlayedValue(Math.floor(e.playedSeconds));
                }}
            />
            {isReady && (
                <>
                    <Button
                        variant="text"
                        className={'za-video-play' + (isPlaying ? ' za-video-playing' : '')}
                        onClick={() => setIsPlaying(!isPlaying)}>
                        <div>
                            <Icon name={isPlaying ? 'player-pause' : 'player-play'} />
                        </div>
                    </Button>
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
                        <Button variant="text">
                            <div>
                                <Icon name="arrows-maximize" />
                            </div>
                        </Button>
                        <Button
                            className="video-volume"
                            variant="text"
                            onClick={() => setIsMute(!isMute)}>
                            <div>
                                <Icon name={isMute ? 'volume-off' : 'volume'} />
                            </div>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Video;
