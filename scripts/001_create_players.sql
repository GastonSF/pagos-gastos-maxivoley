-- Create players table that references auth.users
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL UNIQUE,
  telefono TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'activo', 'inactivo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policy: Players can view their own data
CREATE POLICY "players_select_own" ON public.players 
  FOR SELECT USING (auth.uid() = id);

-- Policy: Players can update their own data
CREATE POLICY "players_update_own" ON public.players 
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow insert for authenticated users (their own profile)
CREATE POLICY "players_insert_own" ON public.players 
  FOR INSERT WITH CHECK (auth.uid() = id);
