import { getKnexClient, closeKnexClient } from '../lib/knex-client';

async function main() {
  const knex = await getKnexClient();
  const result = await knex.raw(`
    select
      slug,
      is_published,
      coalesce(page_folder_id, '00000000-0000-0000-0000-000000000000'::uuid) as folder_key,
      coalesce(error_page, 0) as error_key,
      coalesce(settings->>'qay_site_id', '__ycode_global__') as site_key,
      count(*) as duplicate_count,
      array_agg(id order by created_at asc, id asc) as ids,
      array_agg(name order by created_at asc, id asc) as names,
      array_agg(created_at order by created_at asc, id asc) as created_ats
    from pages
    where deleted_at is null
    group by 1,2,3,4,5
    having count(*) > 1
    order by duplicate_count desc, site_key, error_key, slug
  `);

  console.log(JSON.stringify(result.rows, null, 2));
  await closeKnexClient();
}

main().catch(async (error) => {
  console.error(error);
  await closeKnexClient();
  process.exit(1);
});
