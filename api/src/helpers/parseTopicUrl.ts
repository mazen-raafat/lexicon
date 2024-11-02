export type FilterInput = {
  sort: 'TOP' | 'LATEST';
  topPeriod?:
    | 'ALL'
    | 'DAILY'
    | 'MONTHLY'
    | 'QUATERLY'
    | 'WEEKLY'
    | 'YEARLY'
    | null;
  tag?: string | null;
  categoryId?: number | null;
  slug?: string | null;
};

const parseTopicUrl = ({
  sort,
  topPeriod,
  tag,
  categoryId,
  slug,
}: FilterInput) => {
  let sortBy = sort.toLowerCase();
  if (sort === 'TOP' && topPeriod && !tag) {
    sortBy = `${sortBy}/${topPeriod.toLowerCase()}`;
  }
  if (categoryId) {
    if (tag) {
      sortBy = `tags/c/${slug}/${categoryId}/${tag}/l/${sortBy}`;
    } else {
      sortBy = `c/${slug}/${categoryId}/l/${sortBy}`;
    }
  } else if (tag) {
    sortBy = `tag/${tag}/l/${sortBy}`;
  }
  return sortBy;
};

export { parseTopicUrl };
