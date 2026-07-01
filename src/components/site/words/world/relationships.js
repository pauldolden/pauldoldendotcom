// Shared relationship-category palette (design tokens), used by the family
// tree, the relationship graph, and the profile relationship groups.
export const CATEGORY_COLOR = {
  family: 'var(--accent)',
  social: 'var(--cyan-400)',
  org: 'var(--purple-300)',
  possession: 'var(--status-hiatus)',
  spatial: 'var(--status-ongoing)',
  other: 'var(--text-faint)',
}

/** Predicates (from an entity's POV) that place another entity in a family tree. */
export const FAMILY_POV = {
  parents: ['child_of'], // ego is child_of X → X is a parent
  children: ['parent_of'],
  siblings: ['sibling_of'],
  partners: ['married_to', 'partner_of'],
}
