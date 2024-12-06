import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { SUPABASE_KEY, SUPABASE_URL } from '../../../env';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;