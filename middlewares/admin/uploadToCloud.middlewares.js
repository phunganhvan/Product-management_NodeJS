const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET // API SECRET Click 'View API Keys' above to copy your API secret
});

module.exports.uploads= (req, res, next) => {
        if (req.file) {
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );

                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            async function upload(req) {
                let result = await streamUpload(req);
                // console.log(result.url);
                req.body[req.file.fieldname] = result.url;
                // console.log(req.body[req.file.fieldname]);
                // thumbnail
                next();
            }
            upload(req);
        }
        else{
            next();
        }
    }