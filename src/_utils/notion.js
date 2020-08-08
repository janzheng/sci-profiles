
/*


	Helpers to get Notion documents

	- uses the public Notion Potion API endpoint right now but should probably implement the API 
	  locally, eventually, since can deconstruct more blocks than just HTML
		- https://github.com/benborgers/potion
	- Workflow is to read a Notion table of pages, get their ideas, figure out which one's published, and get the first published page's content

	Tables: https://potion-api.now.sh/table?id=77ef4b819c23499c8b9bb4bfcd3a1910
	Docs: 	https://potion-api.now.sh/html?id=a1d3c038-dca0-4893-891f-589194810e56

*/

import fetch from "node-fetch"

const table = [] // table of notion pages w/ field props
const page = '' // the page w/ all the html scraped w/ Potion




export const getTable = async (tableId) => {
	const res = await fetch(`https://potion-api.now.sh/table?id=${tableId}`)
	const data = await res.json()
	// console.log('table:', data)
	return data
}

export const getPage = async (pageId) => {
	const res = await fetch(`https://potion-api.now.sh/html?id=${pageId}`)
	const data = await res.text()
	return data
}


// gets the first published page content given a table
export const getContentFromTable = async (tableId) => {
	// const table = await getTable('77ef4b819c23499c8b9bb4bfcd3a1910')
	const table = await getTable(tableId)
	let page, pageContent

	if(table && table.length > 0)
		page = table.find(row => row.fields['Status'] === 'Published')

	// console.log('page:', page)
	if(page)
		pageContent = await getPage(page.id)

	return {
		page: page, // page data
		content: pageContent,
	}
}

