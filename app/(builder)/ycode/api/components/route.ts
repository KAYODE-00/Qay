import { NextRequest, NextResponse } from 'next/server';
import { getAllComponents, createComponent } from '@/lib/repositories/componentRepository';
import { canAccessQaySite } from '@/qay/lib/site-access';
import { getQaySiteIdFromRequest } from '@/qay/lib/page-access';
import { filterComponentsForQaySite, linkComponentToQaySite } from '@/qay/lib/site-components';

/**
 * GET /ycode/api/components
 * Get all components
 */
export async function GET(request: NextRequest) {
  try {
    const siteId = getQaySiteIdFromRequest(request);
    if (siteId && !(await canAccessQaySite(siteId))) {
      return NextResponse.json({ error: 'Not authorized for QAY site' }, { status: 403 });
    }

    const components = await getAllComponents();
    const scopedComponents = siteId
      ? await filterComponentsForQaySite(siteId, components)
      : components;
    
    return NextResponse.json({ data: scopedComponents });
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}

/**
 * POST /ycode/api/components
 * Create a new component
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, layers, variables } = body;
    
    if (!name || !layers) {
      return NextResponse.json(
        { error: 'Missing required fields: name, layers' },
        { status: 400 }
      );
    }
    
    const component = await createComponent({ name, layers, variables });
    const siteId = getQaySiteIdFromRequest(request);
    if (siteId) {
      if (!(await canAccessQaySite(siteId))) {
        return NextResponse.json({ error: 'Not authorized for QAY site' }, { status: 403 });
      }
      await linkComponentToQaySite(siteId, component.id, { source: 'user', category: 'Saved components' });
    }
    
    return NextResponse.json({ data: component }, { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    );
  }
}
