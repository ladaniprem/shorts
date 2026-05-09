import { AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig, Video } from 'remotion'

interface CaptionProps {
    text: string
    startFrame: number
    endFrame: number
}

interface VideoComponentProps {
    imageLinks?: string[]
    audio?: string
    videoSrc?: string
    startFromFrame?: number
    caption?: CaptionProps[]
    durationInFrames?: number
    captionStyle?: 'classic' | 'modern' | 'gamer'
}

export const VideoComponent: React.FC<VideoComponentProps> = ({
    imageLinks = [],
    audio,
    videoSrc,
    startFromFrame = 0,
    caption = [],
    captionStyle = 'classic'
}) => {
    const frame = useCurrentFrame()
    const { width, height, durationInFrames } = useVideoConfig()
    const imageCount = Math.max(1, imageLinks.length)
    const framesPerImage = Math.ceil(durationInFrames / imageCount)

    // Group captions into chunks of 3 words shown together
    const chunkSize = 3
    const chunks: CaptionProps[][] = []
    for (let i = 0; i < caption.length; i += chunkSize) {
        chunks.push(caption.slice(i, i + chunkSize))
    }

    const activeChunkIndex = chunks.findIndex(
        (chunk) => frame >= chunk[0].startFrame && frame <= chunk[chunk.length - 1].endFrame,
    )
    const currentChunk = activeChunkIndex >= 0 ? chunks[activeChunkIndex] : []

    // Font size: 7.5% of width — legible on 1080px wide video
    const fontSize = width * 0.075

    const renderCaption = () => {
        if (currentChunk.length === 0) return null

        switch (captionStyle) {
            case 'modern':
                return (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: height * 0.15,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: width * 0.02,
                            width: width * 0.85,
                        }}
                    >
                        {currentChunk.map((word, index) => {
                            const isCurrent = frame >= word.startFrame && frame <= word.endFrame
                            return (
                                <span
                                    key={index}
                                    style={{
                                        color: isCurrent ? '#00FFCC' : '#FFFFFF',
                                        fontWeight: 800,
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: isCurrent ? fontSize * 1.1 : fontSize,
                                        transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'all 0.1s',
                                        textTransform: 'uppercase',
                                        textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {word.text}
                                </span>
                            )
                        })}
                    </div>
                )
            case 'gamer':
                return (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: height * 0.1,
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        {currentChunk.map((word, index) => {
                            const isCurrent = frame >= word.startFrame && frame <= word.endFrame
                            if (!isCurrent) return null
                            return (
                                <span
                                    key={index}
                                    style={{
                                        color: '#FF00FF',
                                        fontWeight: 900,
                                        fontFamily: 'Impact, sans-serif',
                                        fontSize: fontSize * 1.5,
                                        textTransform: 'uppercase',
                                        WebkitTextStroke: '4px #000000',
                                        textShadow: '8px 8px 0 #000000',
                                        display: 'inline-block',
                                        transform: 'rotate(-2deg)',
                                    }}
                                >
                                    {word.text}
                                </span>
                            )
                        })}
                    </div>
                )
            case 'classic':
            default:
                return (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: height * 0.12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: width * 0.018,
                            backgroundColor: 'rgba(0, 0, 0, 0.55)',
                            borderRadius: width * 0.03,
                            paddingTop: height * 0.012,
                            paddingBottom: height * 0.012,
                            paddingLeft: width * 0.04,
                            paddingRight: width * 0.04,
                            maxWidth: width * 0.9,
                        }}
                    >
                        {currentChunk.map((word, index) => {
                            const isCurrent = frame >= word.startFrame && frame <= word.endFrame
                            return (
                                <span
                                    key={`${word.startFrame}-${word.endFrame}-${index}`}
                                    style={{
                                        color: isCurrent ? '#FFE000' : '#FFFFFF',
                                        fontWeight: isCurrent ? 900 : 600,
                                        fontFamily: 'Impact, Arial Black, Arial, sans-serif',
                                        fontSize,
                                        letterSpacing: '0.02em',
                                        textTransform: 'uppercase',
                                        textShadow: isCurrent
                                            ? '0 0 20px rgba(255,224,0,0.6), -2px -2px 4px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.9)'
                                            : '-2px -2px 4px rgba(0,0,0,0.9), 2px -2px 4px rgba(0,0,0,0.9), -2px 2px 4px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.9)',
                                        transition: 'color 0.1s',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {word.text}
                                </span>
                            )
                        })}
                    </div>
                )
        }
    }

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#000',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Background: Video Clip OR AI Images */}
            {videoSrc ? (
                <Video
                    src={videoSrc}
                    startFrom={startFromFrame}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                imageLinks.map((imageLink, index) => {
                    const startFrame = index * framesPerImage
                    return (
                        <Sequence key={index} from={startFrame} durationInFrames={framesPerImage}>
                            <Img src={imageLink} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Sequence>
                    )
                })
            )}

            {/* Audio: Only if not using original video audio */}
            {!videoSrc && audio ? <Audio src={audio} /> : null}

            {/* Captions */}
            {renderCaption()}

        </AbsoluteFill>
    )
}