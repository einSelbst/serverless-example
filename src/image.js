// @ts-check
import imageSize from 'image-size';
import { imgconfig } from './config';
import { get, upload } from './s3';
import sharpify from './sharpify';
import { makeKey, decodeS3EventKey } from './utils';

const { key: fileNameKey, params, output } = imgconfig;

const outputdir = output.default.outputdir;

const imageMimeTypes = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
};

export default (async function processItem (event) {

    const { eventName, s3: { object: { key: undecodedKey } } = { object: { key: false } },} = event;
    const key = decodeS3EventKey(undecodedKey);

    if (eventName.split(':')[0] !== 'ObjectCreated') {
        throw new Error(
            `Event does not contain a valid type (e.g. ObjectCreated). Invoked by event name: ${eventName}`
        );
    }

    if (!key) {
        throw new Error(`Event does not contain a valid S3 Object Key. Invoked with key: ${key}`);
    }

    const { Body: image, ContentType: type } = await get({ Key: key });

    const dimensions = imageSize(image);

    const width = dimensions.width;

    const aspectRatio = dimensions.width / dimensions.height;

    // Width has to be an integer for sharp.
    const sizes = [
        {
            width: width / 6,
            key: '1_6',
        },
        {
            width: width / 4,
            key: '1_4',
        },
        {
            width: width / 3,
            key: '1_3',
        },
        {
            width: width / 2,
            key: '1_2',
        },
        {
            width: (width * 2) / 3,
            key: '2_3',
        },
        {
            width: width,
            key: '1',
        }

    ].map(({width, key}) => {
        return {
            key,
            // we need to have positive integers
            width: Math.round(width),
            height: Math.round(width / aspectRatio),
        };
    });

    console.log("sizes (widths): " + JSON.stringify(sizes));
    console.log("width: " + width);
    console.log("aspectRatio: " + aspectRatio);
    console.log("dimensions: " + dimensions.width + "/" + dimensions.height);

    const streams = await sharpify(image, imgconfig, sizes);
    const context = { key, type };

    return Promise.all(
        streams.map(async (stream, index) => {
            const size = sizes[index];
            return upload(stream, {
                ContentType: imageMimeTypes[(await stream.metadata()).format],
                ...params,
                Key: makeKey(fileNameKey, context, size.key, outputdir),
            });
        })
    );
});
