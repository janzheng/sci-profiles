
/*

  /api/profile/{profile}

  - please refer to api/profile/index
  - this gets the slug w/ Sapper and calls Capsid API
  - gets a specific profile from a slug

*/

import * as index from "./index.js";

// this gets the appropriate slug for index
export function get(req, res) {
  index.get(req, res)
}

