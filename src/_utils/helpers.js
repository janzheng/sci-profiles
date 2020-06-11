
import socialParser from './social-parser';

export const mdReplace = (text, replacer) => {
	/*
		text: hello { name }
		replacer: {
			name: 'banana!'
		}

		result = "hello banana!"

	*/
  let result = text

  // console.log('replacer::::', text, replacer)
  Object.keys(replacer).map((key) => {
    // let regex = `/\\{\\{\\s*${key}\\s*\\}\\}/g`
    let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    result = result.replace(regex, replacer[key])
    // console.log('replacing result:', key, result, regex)
  })

  // console.log('result::::', result)
  return result
}



// text: template used to replace {{linkedin}} with actual links
// socialStr: text with the raw social URLs
export const socialize = (text, socialStr) => {
  let result = text
  const replacer = socialParser.parse(socialStr)

  Array.from(replacer.keys()).map(key => {
    let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    result = result.replace(regex, replacer.get(key).url)
    // if (social.type ==)
  })

  return {text: result, data: [... replacer.values()]}
}

export const socialParse = (socialStr) => {
  return socialParser.parse(socialStr).values()
}

