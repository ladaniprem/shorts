// alternative remotion and there is best tool to compare remotion lambda is img.ly video api,
//  but remotion lambda is more powerful and flexible than img.ly video api, 
// because remotion lambda allows you to render videos in the cloud using AWS Lambda, 
// which is a serverless compute service that runs your code in response to events and automatically manages the underlying compute resources for you. 
// This means that you can render videos without having to worry about the infrastructure, and you can scale up or down as needed. 
// On the other hand, img.ly video api is a third-party service that provides a simple API for rendering videos, but it may not be as flexible or powerful as remotion lambda.
//  Additionally, remotion lambda allows you to use your own custom compositions and input props, while img.ly video api may have limitations on the types of videos you can render. 
// Overall, remotion lambda is a more robust and versatile solution for rendering videos in the cloud compared to img.ly video api.

import { prisma } from "@/lib/prisma"
import { getRenderProgress, renderMediaOnLambda } from "@remotion/lambda/client"

export const renderVideo = async (videoId: string) => {
    try {
        const data = await prisma.video.findUnique({
            where: {
                videoId: videoId
            }
        })

        if (!data) {
            return undefined
        }

        // Helper to convert MM:SS or HH:MM:SS to frames (30fps)
        const parseTimeToFrames = (timeStr: string | null) => {
            if (!timeStr) return 0
            const parts = timeStr.split(':').map(Number)
            let seconds = 0
            if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
            else if (parts.length === 2) seconds = parts[0] * 60 + parts[1]
            else seconds = parts[0]
            return Math.floor(seconds * 30)
        }

        const { bucketName, renderId } = await renderMediaOnLambda({
            region: 'ap-south-1',
            functionName: 'remotion-render-4-0-452-mem2048mb-disk2048mb-120sec',
            composition: 'MyVideo',
            serveUrl: 'https://remotionlambda-apsouth1-cofkjrdk66.s3.ap-south-1.amazonaws.com/sites/ai-short/index.html',
            codec: 'h264',
            inputProps: {
                imageLinks: data.imageLinks,
                audio: data.audio,
                videoSrc: data.isLongToShort ? data.sourceUrl : null,
                startFromFrame: data.isLongToShort ? parseTimeToFrames(data.startTime) : 0,
                caption: data.caption,   // must match VideoComponent prop name
                durationInFrames: data.duration,
                captionStyle: data.captionStyle || 'classic'
            },
            // Important Note on AWS Lambda Concurrency Limits and Frame Rendering:
            // by default a lambda can the only render medium 200 frames, and there only provided every accounts 10 lambda only 
            // so if we have a video of 1000 frames, then we can render 200 frames in one lambda and then we can render the next 200 frames in another lambda and so on
            // there raised the support ticket but there can not respond the aws.
            // 2k-2.5k frames
            //With a default AWS Lambda concurrency limit of 10 for new accounts, Remotion Lambda allows you to render large videos by splitting the workload into chunks. If your account has a limit of 10, you can configure the  setting in the Remotion CLI to distribute a large project across 10 concurrent Lambda functions, keeping you within the rate limit while significantly speeding up rendering compared to a local machine. [1, 2, 3, 4, 5]  

            // How to Use 10 Lambda Functions for Frames 
            // Understand the Limit: New AWS accounts might be restricted to a concurrency limit of 10, meaning only 10 Lambda functions can run simultaneously. 
            // Set : To render a large video (e.g., 900 frames) within this limit, divide the total frames by 10. For example, setting  allows 9 Lambda functions to render frames, plus one orchestration function, staying under the 10-concurrency cap. 
            // Configuration: Use  and specify  to split work. 
            // Result: This technique allows for distributed rendering, turning a long-running video project into faster, parallel chunks. [2, 3, 4, 6, 7]  

            // Key Considerations 
            //  Storage & Memory: Lambda offers up to 10GB of storage and 10GB of RAM. 
            // Timeout: The maximum execution time per Lambda function is 15 minutes. 
            //  ARM Architecture: Lambda functions use ARM architecture for cost-effective performance. 
            //  Monitoring: Use  to monitor the status of your distributed rendering task. [1, 6, 8, 9]  

            // refrences: 
            // [1] https://www.remotion.dev/docs/lambda
            // [2] https://www.remotion.dev/docs/lambda/troubleshooting/rate-limit
            // [3] https://www.remotion.dev/lambda
            // [4] https://www.remotion.dev/docs/lambda/concurrency
            // [5] https://www.remotion.dev/docs/distributed-rendering
            // [6] https://www.remotion.dev/docs/lambda/limits
            // [7] https://www.remotion.dev/docs/lambda/rendermediaonlambda
            // [8] https://www.remotion.dev/blog/3-0
            // [9] https://www.remotion.dev/docs/lambda/getrenderprogress


            framesPerLambda: 400 //something 4-6 lamada use it there limited in 10 lamada only.

        })

        while (true) {
            const progress = await getRenderProgress({
                region: 'ap-south-1',
                functionName: 'remotion-render-4-0-452-mem2048mb-disk2048mb-120sec',
                renderId,
                bucketName,
            })
            if (progress.fatalErrorEncountered) {
                console.log('redner failed:', progress.errors)
            }

            if (progress.done) {
                const videoUrl = progress.outputFile ||
                    `https://${bucketName}.s3.ap-south-1.amazonaws.com/${renderId}/out.mp4`

                console.log(videoUrl)

                await prisma.video.update({
                    where: {
                        videoId: videoId
                    },
                    data: {
                        videoUrl: videoUrl,
                        processing: false
                    }
                })

                return videoUrl
            }

            const framesRendered = progress.framesRendered || 0
            const percent = Math.floor(progress.overallProgress * 100)

            console.log(`progress is ${percent} , frames rendered is ${framesRendered}`)
        }
    }
    catch (error) {
        console.error('error while generating video in remotion', error)
        throw error
    }
}