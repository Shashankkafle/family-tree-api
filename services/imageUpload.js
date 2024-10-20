const cloudinary = require('cloudinary').v2;
const stream = require('stream');
// Return "https" URLs by setting secure: true
cloudinary.config({
	secure: true,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: process.env.CLOUD_NAME,
});
const uploadImage = async (imageBuffer) => {
	const options = {
		resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
		public_id: Date.now().toString(),
		overwrite: true,
	};

	// Create a new Promise to handle the upload process
	return new Promise((resolve, reject) => {
		const bufferStream = new stream.PassThrough();
		bufferStream.end(imageBuffer);

		// Upload the image using the stream
		const uploadStream = cloudinary.uploader.upload_stream(
			options,
			(error, result) => {
				if (error) {
					return reject(error);
				}
				resolve(result.secure_url);
			}
		);

		// Pipe the buffer to Cloudinary
		bufferStream.pipe(uploadStream);
	});
};

// Gets details of an uploaded image
const getAssetInfo = async (publicId) => {
	const options = {
		colors: true,
	};

	try {
		const result = await cloudinary.api.resource(publicId, options);
		console.log(result);
		return result.colors;
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	uploadImage,
	getAssetInfo,
};
