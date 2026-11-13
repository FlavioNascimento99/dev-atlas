export const CATEGORY_FILE = 'category.yaml'
export const TOPIC_FILE = 'topic.yaml'
export const LEARNING_PATHS_FILE = 'learning-paths.yaml'

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const

export const REFERENCE_TYPES = ['documentation', 'book', 'article', 'paper', 'specification'] as const

export const CATEGORY_ICONS = [
  'cpu',
  'git-fork',
  'network',
  'blocks',
  'puzzle',
  'globe',
  'server',
  'database',
  'radio-tower',
  'shield',
] as const

/** Editorial model of a topic (doc 01 §4.1), in reading order. */
export const EDITORIAL_SECTIONS = [
  'overview',
  'how-it-works',
  'visual-demonstration',
  'when-to-use',
  'when-not-to-use',
  'advantages-and-disadvantages',
  'trade-offs',
  'real-world-examples',
  'implementation-examples',
  'common-misconceptions',
  'related-concepts',
  'references',
] as const

/** Sections rendered from topic metadata instead of being written in MDX, to avoid duplicating data. */
const METADATA_SECTIONS = ['related-concepts', 'references'] as const

export const MDX_SECTIONS = EDITORIAL_SECTIONS.filter(
  (section): section is Exclude<(typeof EDITORIAL_SECTIONS)[number], (typeof METADATA_SECTIONS)[number]> =>
    !METADATA_SECTIONS.some((metadataSection) => metadataSection === section),
)
