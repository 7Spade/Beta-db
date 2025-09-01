import { config } from 'dotenv';
config();

import '@/features/integrations/ai/flows/extract-work-items-flow';
import '@/features/integrations/ai/flows/generate-knowledge-entry-flow';
import '@/features/integrations/ai/flows/generate-skill-flow';
import '@/features/integrations/ai/flows/generate-subtasks-flow';

