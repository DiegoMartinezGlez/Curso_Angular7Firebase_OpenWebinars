import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


const {Storage} = require('@google-cloud/storage')
const gcs = new Storage()
const spawn = require('child-process-promise').spawn

export const resizeImage = functions.storage.object()
.onFinalize ( async object => {
	const filePath = object.name
	const fileName = filePath.split('/').pop()
	const fileBucket = object.bucket
	const bucket = gcs.bucket( fileBucket )
	const tempFilePath = '/tmp/${fileName}'

	console.log('fileName: ' + fileName )
	console.log('fileName.startsWith(thumb): ' + fileName.startsWith('thumb_') )
	if ( fileName.startsWith('thumb_') ) {
		console.log('already a thumbnail')
		return 
	}

	if ( !object.contentType.startsWith('image/') ) {
		console.log('This is not an image')
		return 
	}

	return bucket.file(filePath).download({
		destination: tempFilePath
	}).then( () => {
		console.log('Image downloaded locally to ', tempFilePath)
		spawn ( 'convert', [tempFilePath, "-resize", "20x20>", tempFilePath])
	}).then( () => {
		console.log('Thumb created')
		const thumbFilePath = filePath.replace(fileName, 'thumb_'+fileName)
		console.log('thumbFilePath: ' + thumbFilePath)
		return bucket.upload(tempFilePath, {
			destination: thumbFilePath
		})
	} )

})





const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

exports.sendEmail = functions.https.onRequest((req, res) => {
    
    return cors(req, res, () => {
        const mailOptions = {
            from: 'CloudFunctionEmail!',
            to: req.query.rsEmail,
            subject: req.query.rsSubject,
            html: ''
        };
        // hmtl message constructions
        mailOptions.html = `<p><b>Nombre: </b>${req.query.rsName}</p>
                            <p><b>Email: </b>${req.query.rsEmail}</p>
                            <p><b>Mensaje: </b>${req.query.rsMessage}</p>`;
        
        console.log('email body: ' + mailOptions.html);

        console.log('req: ', req);
        console.log('req.query: ', req.query);
        console.log('req.query.rsSubject: ', req.query.rsSubject);
        console.log('req.query.rsName: ', req.query.rsName);
        console.log('req.query.rsEmail: ', req.query.rsEmail);
        console.log('req.query.rsMessage: ', req.query.rsMessage);

        if(req.query.rsSubject===undefined || req.query.rsName===undefined || req.query.rsEmail===undefined || req.query.rsMessage===undefined) {
            console.log('Error enviando email: falta info');
            res.status(400).send("Error: falta info");
            return "Error: falta info";
        }
        
        console.log('enviado email ...');

        return mailTransport.sendMail(mailOptions).then(()=> { 
            res.status(200).send(true);
            console.log('Email enviado!');
            return "Email enviado!";
        })
        .catch(reason => {
            console.log('Error enviando email: ' + reason);
            res.status(500).send("Error enviando email: " + reason)
        });
        }
    );
});

const mailTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: '***@gmail.com',
        pass: '***'
    }
});
