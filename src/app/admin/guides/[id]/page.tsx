import React from 'react';
import { createClient } from '@/utils/supabase/server';
import GuideForm from '@/components/admin/GuideForm';
import { notFound } from 'next/navigation';

export default async function AdminGuideEditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const isNew = params.id === 'new';
  const supabase = await createClient();

  // Fetch all destinations for the mapping checklist
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, title')
    .order('title');

  let guide = null;
  let guideDestinationIds: string[] = [];

  if (!isNew) {
    const { data } = await supabase
      .from('tour_guides')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!data) return notFound();
    guide = data;

    // Fetch existing mappings
    const { data: mappings } = await supabase
      .from('guide_destinations')
      .select('destination_id')
      .eq('guide_id', params.id);
      
    if (mappings) {
      guideDestinationIds = mappings.map(m => m.destination_id);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          {isNew ? 'Add New Tour Guide' : 'Edit Tour Guide'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isNew ? 'Create a new guide profile and assign destinations.' : 'Update guide profile and manage assigned destinations.'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <GuideForm 
          guide={guide} 
          destinations={destinations || []} 
          guideDestinationIds={guideDestinationIds} 
        />
      </div>
    </div>
  );
}
