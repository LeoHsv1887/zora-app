-- ============================================================
-- Zora App — Datenbankschema
-- Ausführen im Supabase SQL Editor
-- ============================================================

-- Nutzerprofile
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  vorname TEXT,
  nachname TEXT,
  telefon TEXT,
  nutzertyp TEXT, -- 'privatperson', 'handwerker', 'kmu'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Firmenprofil (für Handwerker und KMU)
CREATE TABLE firmenprofile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  firmenname TEXT,
  rechtsform TEXT,
  branche TEXT,
  mitarbeiter TEXT,
  bundesland TEXT,
  plz TEXT,
  ort TEXT,
  umsatz TEXT,
  steuernr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gespeicherte Förderanträge
CREATE TABLE antraege (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  programm_id TEXT,
  programm_name TEXT,
  foerderstelle TEXT,
  status TEXT DEFAULT 'entwurf', -- 'entwurf', 'in_bearbeitung', 'eingereicht', 'bewilligt', 'abgelehnt'
  foerderbetrag_beantragt DECIMAL,
  foerderbetrag_bewilligt DECIMAL,
  form_data JSONB,
  ki_text TEXT,
  notizen TEXT,
  eingereicht_am TIMESTAMP WITH TIME ZONE,
  bescheid_am TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gespeicherte Förderprogramme (Merkliste)
CREATE TABLE gespeicherte_programme (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  programm_id TEXT,
  programm_name TEXT,
  programm_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, programm_id)
);

-- Row Level Security aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE firmenprofile ENABLE ROW LEVEL SECURITY;
ALTER TABLE antraege ENABLE ROW LEVEL SECURITY;
ALTER TABLE gespeicherte_programme ENABLE ROW LEVEL SECURITY;

-- Policies: Nutzer sehen nur ihre eigenen Daten
CREATE POLICY "Eigene Daten lesen" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Eigene Daten schreiben" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Eigene Daten updaten" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Eigene Firma lesen" ON firmenprofile FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Eigene Antraege" ON antraege FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Eigene Programme" ON gespeicherte_programme FOR ALL USING (auth.uid() = user_id);

-- Trigger: updated_at automatisch setzen
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER firmenprofile_updated_at BEFORE UPDATE ON firmenprofile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER antraege_updated_at BEFORE UPDATE ON antraege
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: Profil automatisch beim Signup anlegen
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, vorname, nachname)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'vorname',
    NEW.raw_user_meta_data ->> 'nachname'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
