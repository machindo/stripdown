import type Joplin from './Joplin'

declare global {
  var joplin: Joplin
}

export default globalThis.joplin
