

// requires server to read form data using 
/*

*/



import send from '@polka/send';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear } from "../../../../_utils/cache"
import { sendData } from "../../../../_utils/sapper-helpers" 
import { saveSetup, save } from '../../../../_utils/save.js'


import util from 'util'
import fs from 'fs'
import sharp from 'sharp' // image rendering

config(); // https://github.com/sveltejs/sapper/issues/122

import formidable from 'formidable'

const async_readFile = util.promisify(fs.readFile);

const upload_dir = '/tmp/' // for local, use './tmp/public'




// save avatar back to airtable
export const saveAvatar = async (recordId, url) => {

	console.log('saving avatar:', recordId, url)

  try {
    const record = await save({
      tableName: 'Profiles',
      payload: {
      	ProfileImage: url,
      },
      recordId,
      insertOptions: ['typecast']
    })

    cacheClear(`profile-${recordId}`)
    cacheClear(`profile-${record.fields['Slug']}`)

    return record

  } catch(e) {
    console.error('saveProfile error:', e)
  }
}






// example: http://localhost:3991/api/profile/avatar?filename=upload_05ceccd0a21f707a1009fa3bf4c4346d
// example: http://localhost:3991/api/profile/avatar/upload_05ceccd0a21f707a1009fa3bf4c4346d
export async function get(req, res) {
	let { filename } = req.params 

  try {
    let path = upload_dir + filename

  	// console.log('[Avatar] Loading image ...', path)

    // check for existence first
    if (fs.existsSync(path)) {
      let data = await async_readFile(path)
      res.writeHead(200, {'Content-Type': 'image/png'});
      // console.log('[Avatar] Image loaded!')
      res.end(data); // Send the file data to the browser.
      // res.download(data)
    } else {
      console.error('[Avatar] No file found')
    }

  } catch(err) {
    console.error('[Avatar] File could not be downloaded :', err)
    next()
  }
}




export async function post(req, res) {
  // const {Name, PublicEmail, Social, Pitch, Title, CV} = req.body

  // if(!req.body.files || req.body.files.length < 1)
  // 	sendData('Please upload an avatar', res, 500)

  // const avatar = req.body.avatar
  // console.log('LOL WHAT', avatar, req.body )

  new formidable.IncomingForm({
  	uploadDir: upload_dir,
  }).parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }

    // console.log('Fields', fields)
    // console.log('Files', files)
    // for (const file of Object.entries(files)) {
    //   console.log(file)
    // }


    const avatarStream = files.avatar._writeStream
    const avatar = files.avatar
    // const avatarUrl = `${req.headers.origin}/${avatar.path}`
    const avatarUrl = `${avatar.path}`
    const avatarName = avatar.name
    const avatarType = avatar.type


    // console.log(avatarUrl, avatar)

    // let image, newimage
    try {
      const image = sharp(avatarUrl)
      const new_file_name = `${avatarUrl}_.png`
      image.metadata().then(metadata => {

        // if(timeline.postImage == "square") {
        //   let length = metadata.width < metadata.height ? metadata.width : metadata.height
        //   if (length > 900)
        //     length = 900

        //   console.log(`[Profile] Resizing image to ${length}x${length}`)
        //   return pipeline.resize({
        //     width: length,
        //     // height: length, // actually square is pretty ugly; can use object-fit
        //     withoutEnlargement: true,
        //     fit: sharp.fit.inside,
        //     // position: sharp.strategy.entropy
        //   })
        //   .png()
        //   .toBuffer();
        // } else {
        let width = metadata.width
        let density = 120

        if(width > 500)
          width = 500

        if(metadata.format == 'svg') {
          // improve density for svg // https://github.com/lovell/sharp/issues/729
          // density = 72*width/16
          return image; // do nothing for svg
        }

        // console.log('[Avatar] metadata:', metadata)
        return image.resize({
          width: width,
          // height: length, // actually square is pretty ugly; can use object-fit
          withoutEnlargement: true,
          // density: density
          // fit: sharp.fit.inside,
          // position: sharp.strategy.entropy
        })
        // .png()
		    .png({ progressive: true, compressionLevel: 7, quality: 40})
        .toFile(new_file_name, async (err, info) => {  
          if(err) {
            console.error('[Avatar] Could not write image to file', err, info)
            return
          }
          console.error('[Avatar] Wrote image to file', `${new_file_name}`, ' errors:' , err, 'info:',  info)
	        
	        // save to airtable, need to get the URL
	        // tmp/public/upload_78dfc2a567b477f845303b949cb0fae2
	        const file_url = req.headers.origin +'/api/profile/avatar/'+ new_file_name.split('/')[2]
	        const profile = await saveAvatar(fields.recordId, file_url)
	    		return sendData(profile, res)
        });
      }).then(function(data) {
      });

      // avatarStream.pipe(pipeline)
    } catch(err) {
      console.error('[Timeline] Error processing the image:', err)
      // next(err)
    }

  })


  // console.log('GETTING AVATAR ??!?!?!?', avatar, req.body.files)


	// const uploadCb = upload.single('file')
	// uploadCb(req, res, function (err) {
	// 	console.log('MULTER?!?!?!?', req.file)
	// 	if (err instanceof multer.MulterError) {
	// 		res.writeHead(500);
	// 		res.end('A Multer error occurred when uploading.');
	// 	} else if (err) {
	// 		res.writeHead(500);
	// 		res.end('An unknown error occurred when uploading.');
	// 	}
	// 	res.writeHead(200, { 'Content-Type': 'application/json' });
	// 	res.end(JSON.stringify(req.file));
	// })


  try {
    // const profile = await saveProfile(req.body)
    // return sendData(profile, res)
  } catch(err) {
    console.error('[api/profile/post]', err)
  }
}
