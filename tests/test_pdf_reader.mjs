import assert from 'node:assert/strict';
import {mostVisiblePage} from '../src/site/assets/js/download-reader-layout.mjs';
// At the end of a short document, a sliver of the previous page must not mask the last page.
assert.equal(mostVisiblePage([{top: -245, bottom: 251}, {top: 275, bottom: 772}], {top: 197, bottom: 788}), 2);
// A long page filling the viewport stays selected until the following page occupies more space.
assert.equal(mostVisiblePage([{top: -100, bottom: 550}, {top: 574, bottom: 1200}], {top: 0, bottom: 600}), 1);
assert.equal(mostVisiblePage([{top: -500, bottom: 150}, {top: 174, bottom: 800}], {top: 0, bottom: 600}), 2);
assert.equal(mostVisiblePage([], {top: 0, bottom: 600}, 3), 3);
console.log('PDF reader scroll regressions passed');
